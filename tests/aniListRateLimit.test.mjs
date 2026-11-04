import assert from "node:assert/strict"
import test from "node:test"
import { createAniListFetch } from "../src/aniListRateLimit.ts"

const endpoint = "https://graphql.anilist.co"
const response = (status = 200, headers = {}) =>
  new Response("{}", { status, headers })
const clock = () => {
  let time = 1_700_000_000_000
  const waits = []
  return {
    now: () => time,
    waits,
    wait: async (delay, signal) => {
      signal?.throwIfAborted()
      waits.push(delay)
      time += delay
    },
  }
}
const deferred = () => {
  let resolve
  const promise = new Promise((done) => {
    resolve = done
  })
  return { promise, resolve }
}

test("serializes concurrent requests with two seconds between starts", async () => {
  const timing = clock()
  const starts = []
  let active = 0
  let maxActive = 0
  const fetch = createAniListFetch({
    ...timing,
    fetch: async () => {
      starts.push(timing.now())
      active++
      maxActive = Math.max(maxActive, active)
      await Promise.resolve()
      active--
      return response()
    },
  })
  await Promise.all([fetch(endpoint), fetch(endpoint), fetch(endpoint)])
  assert.deepEqual(
    starts.map((time) => time - starts[0]),
    [0, 2000, 4000]
  )
  assert.equal(maxActive, 1)
})

test("keeps the temporary 30 limit and slows down for a lower advertised limit", async () => {
  const timing = clock()
  const starts = []
  const fetch = createAniListFetch({
    ...timing,
    fetch: async () => {
      starts.push(timing.now())
      return response(200, {
        "X-RateLimit-Limit": starts.length === 1 ? "90" : "10",
      })
    },
  })
  await fetch(endpoint)
  await fetch(endpoint)
  await fetch(endpoint)
  assert.deepEqual(
    starts.map((time) => time - starts[0]),
    [0, 2000, 8000]
  )
})

test("waits for the reset after successful quota exhaustion and falls back without usable reset", async () => {
  for (const reset of ["1700000010", "bad", "1700000000", ""]) {
    const timing = clock()
    const starts = []
    const fetch = createAniListFetch({
      ...timing,
      fetch: async () => {
        starts.push(timing.now())
        return starts.length === 1
          ? response(200, {
              "X-RateLimit-Remaining": "0",
              "X-RateLimit-Reset": reset,
            })
          : response()
      },
    })
    await fetch(endpoint)
    await fetch(endpoint)
    assert.equal(starts[1] - starts[0], reset === "1700000010" ? 10000 : 60000)
  }
})

test("429 honors the later server deadline and replays a Request body intact", async () => {
  const timing = clock()
  const starts = []
  const bodies = []
  const fetch = createAniListFetch({
    ...timing,
    fetch: async (request) => {
      starts.push(timing.now())
      bodies.push(await request.text())
      return starts.length === 1
        ? response(429, {
            "Retry-After": "3",
            "X-RateLimit-Reset": "1700000007",
          })
        : response()
    },
  })
  const result = await fetch(
    new Request(endpoint, {
      method: "POST",
      body: '{"query":"mutation { save }"}',
    })
  )
  assert.equal(result.status, 200)
  assert.deepEqual(
    starts.map((time) => time - starts[0]),
    [0, 7000]
  )
  assert.deepEqual(bodies, [
    '{"query":"mutation { save }"}',
    '{"query":"mutation { save }"}',
  ])
})

test("429 retries only three times and preserves the final cooldown for the next caller", async () => {
  const timing = clock()
  const starts = []
  const fetch = createAniListFetch({
    ...timing,
    fetch: async () => {
      starts.push(timing.now())
      return starts.length <= 4
        ? response(429, { "Retry-After": "garbage" })
        : response()
    },
  })
  assert.equal((await fetch(endpoint)).status, 429)
  assert.equal(starts.length, 4)
  await fetch(endpoint)
  assert.deepEqual(
    starts.map((time) => time - starts[0]),
    [0, 60000, 120000, 180000, 240000]
  )
})

test("does not replay network failures, other HTTP errors or GraphQL errors", async () => {
  for (const outcome of [
    new Error("offline"),
    response(500),
    new Response('{"errors":[{"message":"failed"}]}'),
  ]) {
    let attempts = 0
    const fetch = createAniListFetch({
      ...clock(),
      fetch: async () => {
        attempts++
        if (outcome instanceof Error) throw outcome
        return outcome
      },
    })
    if (outcome instanceof Error)
      await assert.rejects(fetch(endpoint), /offline/)
    else assert.equal(await fetch(endpoint), outcome)
    assert.equal(attempts, 1)
  }
})

test("queued cancellation rejects before its predecessor finishes and never sends", async () => {
  const gate = deferred()
  const entered = deferred()
  let attempts = 0
  const fetch = createAniListFetch({
    ...clock(),
    fetch: async () => {
      attempts++
      if (attempts === 1) {
        entered.resolve()
        await gate.promise
      }
      return response()
    },
  })
  const first = fetch(endpoint)
  await entered.promise
  const controller = new AbortController()
  const queued = fetch(endpoint, { signal: controller.signal })
  controller.abort()
  await assert.rejects(queued, { name: "AbortError" })
  assert.equal(attempts, 1)
  gate.resolve()
  await first
  await fetch(endpoint)
  assert.equal(attempts, 2)
})

test("cancellation during 429 backoff retains cooldown and leaves the queue usable", async () => {
  const timing = clock()
  const waiting = deferred()
  let attempts = 0
  let firstWait = true
  const controller = new AbortController()
  const fetch = createAniListFetch({
    ...timing,
    wait: async (delay, signal) => {
      if (firstWait) {
        firstWait = false
        waiting.resolve()
        await new Promise((_, reject) =>
          signal.addEventListener("abort", () => reject(signal.reason), {
            once: true,
          })
        )
      } else await timing.wait(delay, signal)
    },
    fetch: async () => {
      attempts++
      return attempts === 1
        ? response(429, { "Retry-After": "10" })
        : response()
    },
  })
  const pending = fetch(endpoint, { signal: controller.signal })
  await waiting.promise
  controller.abort()
  await assert.rejects(pending, { name: "AbortError" })
  await fetch(endpoint)
  assert.equal(attempts, 2)
  assert.equal(timing.now(), 1_700_000_010_000)
})

test("malformed limit headers do not weaken request pacing", async () => {
  for (const limit of ["", "0", "-1", "1.5", "Infinity", "garbage"]) {
    const timing = clock()
    const starts = []
    const fetch = createAniListFetch({
      ...timing,
      fetch: async () => {
        starts.push(timing.now())
        return response(200, { "X-RateLimit-Limit": limit })
      },
    })
    await fetch(endpoint)
    await fetch(endpoint)
    assert.equal(starts[1] - starts[0], 2000)
  }
})

test("Retry-After seconds can extend reset and cannot shorten regular pacing", async () => {
  for (const retryAfter of ["10", "0.5"]) {
    const timing = clock()
    const starts = []
    const fetch = createAniListFetch({
      ...timing,
      fetch: async () => {
        starts.push(timing.now())
        return starts.length === 1
          ? response(429, {
              "Retry-After": retryAfter,
              "X-RateLimit-Reset": "1700000001",
            })
          : response()
      },
    })
    await fetch(endpoint)
    assert.equal(starts[1] - starts[0], retryAfter === "10" ? 10000 : 2000)
  }
})

test("aborted native fetch receives cancellation and a later request still succeeds", async () => {
  const started = deferred()
  let attempts = 0
  const controller = new AbortController()
  const fetch = createAniListFetch({
    ...clock(),
    fetch: async (request) => {
      attempts++
      if (attempts !== 1) return response()
      started.resolve()
      return new Promise((_, reject) =>
        request.signal.addEventListener(
          "abort",
          () => reject(request.signal.reason),
          { once: true }
        )
      )
    },
  })
  const pending = fetch(endpoint, { signal: controller.signal })
  await started.promise
  controller.abort()
  await assert.rejects(pending, { name: "AbortError" })
  await fetch(endpoint)
  assert.equal(attempts, 2)
})

test("a rejected request does not poison the queue and an already-aborted request never sends", async () => {
  let attempts = 0
  const fetch = createAniListFetch({
    ...clock(),
    fetch: async () => {
      attempts++
      if (attempts === 1) throw new Error("offline")
      return response()
    },
  })
  await assert.rejects(fetch(endpoint), /offline/)
  const controller = new AbortController()
  controller.abort()
  await assert.rejects(fetch(endpoint, { signal: controller.signal }), {
    name: "AbortError",
  })
  assert.equal((await fetch(endpoint)).status, 200)
  assert.equal(attempts, 2)
})

test("independent GraphQL clients share pacing and forward their cancellation signal", async () => {
  const { GraphQLClient } = await import("graphql-request")
  const timing = clock()
  const starts = []
  const payloads = []
  const fetch = createAniListFetch({
    ...timing,
    fetch: async (request) => {
      starts.push(timing.now())
      payloads.push(await request.json())
      return new Response('{"data":{"Viewer":{"id":1}}}', {
        headers: { "Content-Type": "application/json" },
      })
    },
  })
  const first = new GraphQLClient(endpoint, { fetch })
  const second = new GraphQLClient(endpoint, { fetch })
  const query = "query Profile { Viewer { id } }"
  await Promise.all([first.request(query), second.request(query)])
  assert.deepEqual(
    starts.map((time) => time - starts[0]),
    [0, 2000]
  )
  assert.deepEqual(
    payloads.map((body) => body.query),
    [query, query]
  )
  const controller = new AbortController()
  controller.abort()
  await assert.rejects(
    second.request({ document: query, signal: controller.signal }),
    { name: "AbortError" }
  )
  assert.equal(starts.length, 2)
})
