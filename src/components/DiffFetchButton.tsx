import { Button } from "@mantine/core"
import axios from "axios"
import { useMemo, useRef, useState } from "react"
import { generateGqlClient as generateAniListGqlClient } from "../aniListApiEntry"
import { MediaListSort } from "../aniListGql"
import { generateGqlClient } from "../annictApiEntry"
import { queryLibraryQuery, StatusState } from "../annictGql"
import { TARGET_SERVICE_MAL, TargetService } from "../constants"
import { ANNICT_TO_MAL_STATUS_MAP, MALAPI, MALListStatus } from "../mal"
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
          // TODO: 共通インターフェースを作ったほうがいいかも
          const serviceStatuses: {}[] = []
          const malStatuses: MALListStatus[] = []
          const aniListStatuses = []

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
              malStatuses.push(...result.data.data)
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

          const missingWorks: AnimeWork[] = []
          const diffs = works
            .map((work) => {
              if (!work.malId) {
                missingWorks.push(work)
                return false
              }
              const malStatus = malStatuses.find(
                (status) => status.node.id.toString() === work.malId
              )
              if (
                !malStatus ||
                malStatus.list_status.status !==
                  ANNICT_TO_MAL_STATUS_MAP[work.status] ||
                (!work.noEpisodes &&
                  malStatus.list_status.num_episodes_watched !==
                    work.watchedEpisodeCount)
              ) {
                const diff: StatusDiff = {
                  work,
                  mal: malStatus
                    ? {
                        status: malStatus.list_status.status,
                        watchedEpisodeCount:
                          malStatus.list_status.num_episodes_watched,
                        title: malStatus.node.title,
                      }
                    : undefined,
                }
                return diff
              }
              return false
            })
            .filter((diff): diff is StatusDiff => !!diff)

          const arm = (await armReq).data

          const missingInOriginWorks = malStatuses
            .filter(
              (malWork) =>
                !works.find((work) => work.malId === malWork.node.id.toString())
            )
            .map((malWork) => {
              const armRelation = arm.find(
                (entry) => entry.mal_id === malWork.node.id
              )
              if (!armRelation || !armRelation.annict_id) {
                return
              }
              return {
                ...malWork,
                annict_id: armRelation.annict_id,
              }
            })
            .filter((x): x is Exclude<typeof x, undefined> => !!x)

          const missingWorksAnnictQuery = await annict.queryWorks({
            workIds: missingInOriginWorks.map(({ annict_id }) => annict_id),
          })

          const additionalDiffs: StatusDiff[] = missingInOriginWorks
            .map((malWork) => {
              const work = missingWorksAnnictQuery.searchWorks?.nodes?.find(
                (work) => work?.annictId === malWork.annict_id
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
                mal: {
                  status: malWork.list_status.status,
                  watchedEpisodeCount: malWork.list_status.num_episodes_watched,
                  title: malWork.node.title,
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
