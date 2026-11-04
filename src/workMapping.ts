import type { AnimeWork } from "./types"

type AniListIdentity = { id: number; malId: string | null }
type MappingInput = {
  works: readonly AnimeWork[]
  media: readonly AniListIdentity[]
}

const parseMalId = (value: string | null): number | null => {
  if (!value || !/^[1-9]\d*$/.test(value)) {
    return null
  }
  const id = Number(value)
  return Number.isInteger(id) && id <= 2147483647 ? id : null
}

export const resolveAniListWorks = ({
  works,
  media,
}: MappingInput): AnimeWork[] => {
  const targetsByMalId = new Map<number, Set<number>>()
  const malIdsByTarget = new Map<number, Set<number>>()
  for (const entry of media) {
    const malId = parseMalId(entry.malId)
    if (!malId || !Number.isSafeInteger(entry.id) || entry.id <= 0) {
      continue
    }
    const targets = targetsByMalId.get(malId) ?? new Set<number>()
    targets.add(entry.id)
    targetsByMalId.set(malId, targets)
    const malIds = malIdsByTarget.get(entry.id) ?? new Set<number>()
    malIds.add(malId)
    malIdsByTarget.set(entry.id, malIds)
  }

  const mappedWorks = works.map((work) => {
    const malId = parseMalId(work.malId)
    const targets = malId ? targetsByMalId.get(malId) : undefined
    const aniListId = targets?.size === 1 ? [...targets][0] : null
    return {
      ...work,
      aniListId:
        aniListId !== null && malIdsByTarget.get(aniListId)?.size === 1
          ? aniListId
          : null,
    }
  })
  const sourceCounts = new Map<number, number>()
  for (const work of mappedWorks) {
    if (work.aniListId !== null) {
      sourceCounts.set(
        work.aniListId,
        (sourceCounts.get(work.aniListId) ?? 0) + 1
      )
    }
  }
  return mappedWorks.map((work) =>
    work.aniListId !== null && sourceCounts.get(work.aniListId) !== 1
      ? { ...work, aniListId: null }
      : work
  )
}

export const getUnresolvedMalIds = ({
  works,
  media,
}: MappingInput): number[] => {
  const knownIds = new Set(
    media.flatMap((entry) => {
      const malId = parseMalId(entry.malId)
      return malId && Number.isSafeInteger(entry.id) && entry.id > 0
        ? [malId]
        : []
    })
  )
  return [
    ...new Set(
      works.flatMap((work) => {
        const malId = parseMalId(work.malId)
        return malId && !knownIds.has(malId) ? [malId] : []
      })
    ),
  ]
}
