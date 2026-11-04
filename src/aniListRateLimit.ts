type FetchOptions = {
  fetch?: typeof globalThis.fetch
  now?: () => number
  wait?: (milliseconds: number, signal?: AbortSignal) => Promise<void>
}

const wait = (milliseconds: number, signal?: AbortSignal): Promise<void> =>
  new Promise((resolve, reject) => {
    signal?.throwIfAborted()
    const finish = () => {
      signal?.removeEventListener("abort", abort)
      resolve()
    }
    const timer = setTimeout(finish, Math.min(milliseconds, 2147483647))
    const abort = () => {
      clearTimeout(timer)
      signal?.removeEventListener("abort", abort)
      reject(signal?.reason)
    }
    signal?.addEventListener("abort", abort, { once: true })
  })

const abortable = <T>(pending: Promise<T>, signal: AbortSignal): Promise<T> =>
  new Promise((resolve, reject) => {
    const abort = () => reject(signal.reason)
    signal.addEventListener("abort", abort, { once: true })
    pending.then(resolve, reject).finally(() => {
      signal.removeEventListener("abort", abort)
    })
    if (signal.aborted) {
      abort()
    }
  })

const numberHeader = (headers: Headers, name: string): number | null => {
  const value = headers.get(name)
  if (!value || !/^\d+(\.\d+)?$/.test(value)) {
    return null
  }
  const number = Number(value)
  return Number.isFinite(number) && number <= Number.MAX_SAFE_INTEGER
    ? number
    : null
}

const cooldown = (headers: Headers, now: number): number => {
  const retryAfter = numberHeader(headers, "Retry-After")
  const reset = numberHeader(headers, "X-RateLimit-Reset")
  const retryAt =
    retryAfter !== null && retryAfter > 0 ? now + retryAfter * 1000 : 0
  const resetAt = reset !== null && reset * 1000 > now ? reset * 1000 : 0
  return Math.max(retryAt, resetAt) || now + 60000
}

export const createAniListFetch = ({
  fetch: send = (...args) => globalThis.fetch(...args),
  now = Date.now,
  wait: pause = wait,
}: FetchOptions = {}): typeof globalThis.fetch => {
  let queue: Promise<void> = Promise.resolve()
  let interval = 2000
  let nextRequestAt = 0
  let blockedUntil = 0

  return async (input, init) => {
    const request = new Request(input, init)
    const signal = request.signal
    signal.throwIfAborted()
    const pending = queue.then(async () => {
      for (let attempt = 0; ; attempt++) {
        signal.throwIfAborted()
        let delay = Math.max(nextRequestAt, blockedUntil) - now()
        while (delay > 0) {
          await pause(delay, signal)
          delay = Math.max(nextRequestAt, blockedUntil) - now()
        }
        signal.throwIfAborted()
        const startedAt = now()
        nextRequestAt = startedAt + interval
        const response = await send(request.clone())
        const limit = numberHeader(response.headers, "X-RateLimit-Limit")
        if (limit !== null && Number.isInteger(limit) && limit > 0) {
          interval = Math.max(interval, Math.ceil(60000 / limit))
          nextRequestAt = Math.max(nextRequestAt, startedAt + interval)
        }
        if (
          response.status === 429 ||
          numberHeader(response.headers, "X-RateLimit-Remaining") === 0
        ) {
          blockedUntil = Math.max(
            blockedUntil,
            cooldown(response.headers, now())
          )
        }
        if (response.status !== 429 || attempt === 3) {
          return response
        }
        await response.body?.cancel().catch(() => undefined)
      }
    })
    queue = pending.then(
      () => undefined,
      () => undefined
    )
    return abortable(pending, signal)
  }
}

export const aniListFetch = createAniListFetch()
