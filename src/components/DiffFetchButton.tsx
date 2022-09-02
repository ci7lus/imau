import { Button } from "@mantine/core"
import axios from "axios"
import { useMemo, useRef, useState } from "react"
import { ANILIST_TO_ANNICT_STATUS_MAP } from "../aniList"
import { generateGqlClient as generateAniListGqlClient } from "../aniListApiEntry"
import { MediaListSort, MediaListStatus } from "../aniListGql"
import { generateGqlClient } from "../annictApiEntry"
import { queryLibraryQuery, StatusState } from "../annictGql"
import { TARGET_SERVICE_MAL, TargetService } from "../constants"
import { MAL_TO_ANNICT_STATUS_MAP, MALAPI } from "../mal"
import { AnimeWork, ServiceStatus, StatusDiff } from "../types"
import { sleep } from "../utils"

export const DiffFetchButton: React.FC<{
  annictAccessToken: string
  targetService: TargetService
  targetAccessToken: string
  statuses: StatusState[]
  setDiffs: React.Dispatch<React.SetStateAction<StatusDiff[]>>
  setChecks: React.Dispatch<React.SetStateAction<Set<number>>>
  setMissingWorks: React.Dispatch<React.SetStateAction<AnimeWork[]>>
  ignores: number[]
}> = ({
  annictAccessToken,
  targetService,
  targetAccessToken,
  statuses,
  setDiffs,
  setChecks,
  setMissingWorks,
  ignores,
}) => {
  const annict = generateGqlClient(annictAccessToken)
  const mal = useMemo(() => new MALAPI(targetAccessToken), [targetAccessToken])
  const aniList = useMemo(
    () => generateAniListGqlClient(targetAccessToken),
    [targetAccessToken]
  )
  const [isFetching, setIsFetching] = useState(false)
  const abortRef = useRef(false)

  return (
    <Button
      color={!isFetching ? "primary" : "red"}
      onClick={async () => {
        if (isFetching) {
          abortRef.current = true
          return
        }
        setIsFetching(true)

        try {
          const serviceStatuses: ServiceStatus[] = []

          const armReq = axios.get<
            { mal_id?: number; annict_id?: number; anilist_id?: number }[]
          >("https://cdn.jsdelivr.net/gh/kawaiioverflow/arm@master/arm.json")

          if (targetService === TARGET_SERVICE_MAL) {
            let offset = 0
            // eslint-disable-next-line no-constant-condition
            while (true) {
              const result = await mal.getAnimeStatuses({
                sort: "anime_start_date",
                limit: 1000,
                offset,
                fields: "list_status",
                nsfw: "true",
              })
              serviceStatuses.push(
                ...result.data.data.map((d) => ({
                  id: d.node.id.toString(),
                  recordId: null,
                  title: d.node.title,
                  status: MAL_TO_ANNICT_STATUS_MAP[d.list_status.status],
                  watchedEpisodeCount: d.list_status.num_episodes_watched,
                }))
              )
              const next = result.data.paging.next
              if (next) {
                const nextUrl = new URL(next)
                const parsedOffset = parseInt(
                  nextUrl.searchParams.get("offset") ?? "NaN"
                )
                if (!Number.isNaN(parsedOffset)) {
                  offset = parsedOffset
                } else {
                  break
                }
              } else {
                break
              }
              if (abortRef.current) {
                break
              }
              await sleep(500)
            }

            if (abortRef.current) {
              return
            }
          } else {
            const user = await aniList.getMe()
            const userId = user.Viewer?.id
            if (!userId) {
              return
            }

            const fetch = async (
              status: MediaListStatus
            ): Promise<ServiceStatus[]> => {
              const result: ServiceStatus[] = []

              let chunk = 0
              // eslint-disable-next-line no-constant-condition
              while (true) {
                const response = await aniList.queryLibrary({
                  userId,
                  sort: [MediaListSort.StartedOn],
                  perChunk: 500,
                  chunk,
                  status,
                })

                const media = response.MediaListCollection?.lists?.flatMap(
                  (list) => list?.entries ?? []
                )
                if (media) {
                  result.push(
                    ...media
                      .map((m) => {
                        if (
                          !m?.id ||
                          !m.media?.title ||
                          !m.status ||
                          m.progress === null
                        ) {
                          return
                        }

                        return {
                          id: m.media.id.toString(),
                          recordId: m.id.toString(),
                          title:
                            m.media.title.english ??
                            m.media.title.romaji ??
                            m.media.title.native ??
                            "",
                          status: ANILIST_TO_ANNICT_STATUS_MAP[m.status],
                          watchedEpisodeCount: m.progress,
                        }
                      })
                      .filter((x): x is Exclude<typeof x, undefined> => !!x)
                  )
                }

                if (abortRef.current) {
                  break
                }
                if (!response.MediaListCollection?.hasNextChunk) {
                  break
                }

                chunk++
              }

              return result
            }

            const result = await Promise.all(
              [
                MediaListStatus.Current,
                MediaListStatus.Completed,
                MediaListStatus.Repeating,
                MediaListStatus.Paused,
                MediaListStatus.Dropped,
                MediaListStatus.Planning,
              ].map((status) => fetch(status))
            )
            serviceStatuses.push(...result.flat())
          }

          const arm = (await armReq).data

          // Annict のレスポンスには AniList ID が含まれないので arm を利用する
          const queryAniListIdByAnnictId = (annictId: number) =>
            arm.find((entry) => entry.annict_id === annictId)?.anilist_id ??
            null

          let after: string | null = null
          const works: AnimeWork[] = []
          // eslint-disable-next-line no-constant-condition
          while (true) {
            const result: queryLibraryQuery = await annict.queryLibrary({
              after,
              states: statuses,
            })
            const structedWorks =
              result.viewer?.libraryEntries?.nodes
                ?.map((entry) => {
                  const work = entry?.work
                  if (!work || !work.annictId || !work.title) {
                    return
                  }
                  const w: AnimeWork = {
                    annictId: work.annictId,
                    malId: work.malAnimeId,
                    aniListId: queryAniListIdByAnnictId(work.annictId),
                    title: work.title,
                    titleEn: work.titleEn || null,
                    titleRo: work.titleRo || null,
                    noEpisodes: work.noEpisodes,
                    watchedEpisodeCount:
                      work?.episodes?.nodes?.filter(
                        (episode) => episode?.viewerDidTrack
                      ).length ?? 0,
                    status: work.viewerStatusState || StatusState.NO_STATE,
                  }
                  return w
                })
                .filter((work): work is AnimeWork => !!work) || []
            works.push(...structedWorks)
            after = result.viewer?.libraryEntries?.pageInfo?.endCursor ?? null
            if (
              !after ||
              result.viewer?.libraryEntries?.pageInfo.hasNextPage === false ||
              abortRef.current
            ) {
              break
            }
            await sleep(500)
          }

          // 現在有効なターゲットの作品IDなどを取得する関数群
          const getTargetWorkId = (work: AnimeWork): string | null => {
            switch (targetService) {
              case "mal":
                return work.malId
              case "anilist":
                return work.aniListId?.toString() || null
              default:
                throw new Error("Unknown target service")
            }
          }
          const getTargetArmId = (entry: {
            mal_id?: number
            anilist_id?: number
          }): string | null => {
            switch (targetService) {
              case "mal":
                return entry.mal_id?.toString() ?? null
              default:
                return entry.anilist_id?.toString() ?? null
            }
          }

          const missingWorks: AnimeWork[] = []
          const diffs = works
            .map((work) => {
              const workId = getTargetWorkId(work)
              if (!workId) {
                missingWorks.push(work)
                return false
              }
              const status = serviceStatuses.find(
                (status) => status.id === workId
              )
              if (
                !status ||
                status.status !== work.status ||
                (!work.noEpisodes &&
                  status.watchedEpisodeCount !== work.watchedEpisodeCount)
              ) {
                const diff: StatusDiff = {
                  work,
                  target: status
                    ? {
                        status: status.status,
                        watchedEpisodeCount: status.watchedEpisodeCount,
                        title: status.title,
                        id: status.recordId ?? status.id,
                      }
                    : undefined,
                }
                return diff
              }
              return false
            })
            .filter((diff): diff is StatusDiff => !!diff)

          const missingInOriginWorks = serviceStatuses
            .filter(
              (serviceWork) =>
                !works.find((work) => serviceWork.id === getTargetWorkId(work))
            )
            .map((serviceWork) => {
              const armRelation = arm.find(
                (entry) => serviceWork.id === getTargetArmId(entry)
              )
              if (!armRelation || !armRelation.annict_id) {
                return
              }
              return {
                ...serviceWork,
                annict_id: armRelation.annict_id,
              }
            })
            .filter((x): x is Exclude<typeof x, undefined> => !!x)

          const missingWorksAnnictQuery =
            0 < missingInOriginWorks.length
              ? await annict.queryWorks({
                  workIds: missingInOriginWorks.map(
                    ({ annict_id }) => annict_id
                  ),
                })
              : null

          const additionalDiffs: StatusDiff[] = missingInOriginWorks
            .map((serviceWork) => {
              const work = missingWorksAnnictQuery?.searchWorks?.nodes?.find(
                (work) => work?.annictId === serviceWork.annict_id
              )
              if (!work) {
                return
              }
              const diff: StatusDiff = {
                work: {
                  annictId: work.annictId,
                  malId: work.malAnimeId,
                  aniListId: queryAniListIdByAnnictId(work.annictId),
                  title: work.title,
                  titleEn: work.titleEn || null,
                  titleRo: work.titleRo || null,
                  noEpisodes: work.noEpisodes,
                  watchedEpisodeCount:
                    work?.episodes?.nodes?.filter(
                      (episode) => episode?.viewerDidTrack
                    ).length ?? 0,
                  status: work.viewerStatusState || StatusState.NO_STATE,
                },
                target: {
                  status: serviceWork.status,
                  watchedEpisodeCount: serviceWork.watchedEpisodeCount,
                  title: serviceWork.title,
                  id: serviceWork.recordId ?? serviceWork.id,
                },
              }
              return diff
            })
            .filter((x): x is Exclude<typeof x, undefined> => !!x)

          diffs.push(...additionalDiffs)
          setDiffs(diffs)
          setChecks(
            new Set(
              diffs
                .map(({ work }) => work.annictId)
                .filter((x) => !ignores.includes(x))
            )
          )
          setMissingWorks(missingWorks)
        } finally {
          setIsFetching(false)
          abortRef.current = false
        }
      }}
    >
      {!isFetching ? "Prepare to sync" : "Stop"}
    </Button>
  )
}
