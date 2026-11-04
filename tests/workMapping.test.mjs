import assert from "node:assert/strict"
import test from "node:test"
import { getUnresolvedMalIds, resolveAniListWorks } from "../src/workMapping.ts"

const work = (annictId, malId) => ({
  annictId,
  malId,
  aniListId: null,
  title: `Work ${annictId}`,
  titleEn: null,
  titleRo: null,
  noEpisodes: false,
  watchedEpisodeCount: 3,
  status: "WATCHING",
})

test("resolves source works using official MAL IDs from library and lookup results", () => {
  const result = resolveAniListWorks({
    works: [work(1, "101"), work(2, "202")],
    media: [
      { id: 10, malId: "101" },
      { id: 20, malId: "202" },
    ],
  })
  assert.deepEqual(
    result.map((entry) => entry.aniListId),
    [10, 20]
  )
})

test("leaves missing, invalid and unavailable MAL IDs unmatched", () => {
  const result = resolveAniListWorks({
    works: [null, "", "0", "-1", "1.5", "1e2", "2147483648", "303"].map(
      (id, index) => work(index + 1, id)
    ),
    media: [
      { id: 10, malId: null },
      { id: 20, malId: "0" },
    ],
  })
  assert.deepEqual(
    result.map((entry) => entry.aniListId),
    Array(8).fill(null)
  )
})

test("deduplicates repeated identities but rejects different targets for one MAL ID", () => {
  const result = resolveAniListWorks({
    works: [work(1, "101"), work(2, "202")],
    media: [
      { id: 10, malId: "101" },
      { id: 10, malId: "101" },
      { id: 20, malId: "202" },
      { id: 21, malId: "202" },
    ],
  })
  assert.deepEqual(
    result.map((entry) => entry.aniListId),
    [10, null]
  )
})

test("rejects multiple source works mapping to the same target", () => {
  const result = resolveAniListWorks({
    works: [work(1, "101"), work(2, "101")],
    media: [{ id: 10, malId: "101" }],
  })
  assert.deepEqual(
    result.map((entry) => entry.aniListId),
    [null, null]
  )
})

test("rejects conflicting target MAL identities even when only one source is selected", () => {
  const result = resolveAniListWorks({
    works: [work(1, "101")],
    media: [
      { id: 10, malId: "101" },
      { id: 10, malId: "202" },
    ],
  })
  assert.deepEqual(
    result.map((entry) => entry.aniListId),
    [null]
  )
})

test("does not manufacture source works for target-only entries or mutate inputs", () => {
  const works = [Object.freeze(work(1, "101"))]
  const media = [
    { id: 10, malId: "101" },
    { id: 20, malId: "202" },
  ]
  const result = resolveAniListWorks({
    works: Object.freeze(works),
    media: Object.freeze(media),
  })
  assert.equal(result.length, 1)
  assert.equal(result[0].aniListId, 10)
  assert.equal(works[0].aniListId, null)
  assert.deepEqual(resolveAniListWorks({ works: [], media }), [])
})

test("queries only unique valid source MAL IDs not already present in library", () => {
  assert.deepEqual(
    getUnresolvedMalIds({
      works: [
        work(1, "101"),
        work(2, "202"),
        work(3, "202"),
        work(4, null),
        work(5, "invalid"),
        work(6, "2147483648"),
      ],
      media: [{ id: 10, malId: "101" }],
    }),
    [202]
  )
})
