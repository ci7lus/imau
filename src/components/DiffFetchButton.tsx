import { Button } from "@mantine/core"
import axios from "axios"
import { useMemo, useRef, useState } from "react"
import { ANILIST_TO_ANNICT_STATUS_MAP } from "../aniList"
import { generateGqlClient as generateAniListGqlClient } from "../aniListApiEntry"
import { MediaListSort } from "../aniListGql"
import { generateGqlClient } from "../annictApiEntry"
import { queryLibraryQuery, StatusState } from "../annictGql"
import { TARGET_SERVICE_MAL, TargetService } from "../constants"
import { MAL_TO_ANNICT_STATUS_MAP, MALAPI } from "../mal"
import { AnimeWork, StatusDiff } from "../types"
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
          const serviceStatuses: {
            id: string
            title: string
            status: keyof typeof StatusState
            watchedEpisodeCount: number
          }[] = []

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
            if (!user.Viewer?.id) {
              return
            }

            let chunk = 0
            // eslint-disable-next-line no-constant-condition
            while (true) {
              const result = await aniList.queryLibrary({
                userId: user.Viewer.id,
                sort: [MediaListSort.StartedOn],
                perChunk: 500,
                chunk,
              })

              const media = result.MediaListCollection?.lists?.flatMap(
                (list) => list?.entries ?? []
              )
              if (media) {
                serviceStatuses.push(
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
                        id: m.id.toString(),
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
                return
              }
              if (!result.MediaListCollection?.hasNextChunk) {
                break
              }

              chunk++
              await sleep(500)
            }
          }

          let after: string | null = null
          const works: AnimeWork[] = []
          for (const status of statuses) {
            // eslint-disable-next-line no-constant-condition
            while (true) {
              const result: queryLibraryQuery = await annict.queryLibrary({
                state: status,
                after,
              })
              const structedWorks =
                result.viewer?.works?.nodes
                  ?.map((work) => {
                    if (!work || !work.annictId || !work.title) {
                      return
                    }
                    const w: AnimeWork = {
                      annictId: work.annictId,
                      malId: work.malAnimeId,
                      title: work.title,
                      titleEn: work.titleEn || null,
                      titleRo: work.titleRo || null,
                      noEpisodes: work.noEpisodes,
                      watchedEpisodeCount:
                        work?.episodes?.nodes?.filter(
                          (episode) => episode?.viewerDidTrack
                        ).length ?? 0,
                      status,
                    }
                    return w
                  })
                  .filter((work): work is AnimeWork => !!work) || []
              works.push(...structedWorks)
              after = result.viewer?.works?.pageInfo?.endCursor ?? null
              if (!after || abortRef.current) {
                break
              }
              await sleep(500)
            }
          }

          const arm = (await armReq).data

          // 現在有効なターゲットの作品IDなどを取得する関数群
          const getTargetWorkId = (work: AnimeWork): string | null => {
            switch (targetService) {
              case "mal":
                return work.malId
              default:
                // Annict のレスポンスには AniList ID が含まれないので arm を利用する
                return (
                  arm
                    .find((entry) => entry.annict_id === work.annictId)
                    ?.anilist_id?.toString() ?? null
                )
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
                (status) => status?.id === workId
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
                        id: status.id,
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

          const missingWorksAnnictQuery = await annict.queryWorks({
            workIds: missingInOriginWorks.map(({ annict_id }) => annict_id),
          })

          const additionalDiffs: StatusDiff[] = missingInOriginWorks
            .map((serviceWork) => {
              const work = missingWorksAnnictQuery.searchWorks?.nodes?.find(
                (work) => work?.annictId === serviceWork.annict_id
              )
              if (!work) {
                return
              }
              const diff: StatusDiff = {
                work: {
                  annictId: work.annictId,
                  malId: work.malAnimeId,
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
                  id: serviceWork.id,
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
