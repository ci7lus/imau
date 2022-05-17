import { Button } from "@mantine/core"
import { useMemo, useRef, useState } from "react"
import { generateGqlClient } from "../annictApiEntry"
import { queryLibraryQuery, StatusState } from "../annictGql"
import { ANNICT_TO_MAL_STATUS_MAP, MALAPI, MALListStatus } from "../mal"
import { AnimeWork, StatusDiff } from "../types"
import { sleep } from "../utils"

export const DiffFetchButton: React.FC<{
  annictAccessToken: string
  malAccessToken: string
  statuses: StatusState[]
  setDiffs: React.Dispatch<React.SetStateAction<StatusDiff[]>>
  setChecks: React.Dispatch<React.SetStateAction<Set<number>>>
  setMissingWorks: React.Dispatch<React.SetStateAction<AnimeWork[]>>
}> = ({
  annictAccessToken,
  malAccessToken,
  statuses,
  setDiffs,
  setChecks,
  setMissingWorks,
}) => {
  const annict = generateGqlClient(annictAccessToken)
  const mal = useMemo(() => new MALAPI(malAccessToken), [malAccessToken])
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
          const malStatuses: MALListStatus[] = []

          {
            let offset = 0
            // eslint-disable-next-line no-constant-condition
            while (true) {
              const result = await mal.getAnimeStatuses({
                sort: "anime_start_date",
                limit: 1000,
                offset,
                fields: "list_status",
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
                    if (
                      !work ||
                      !work.annictId ||
                      !work.title ||
                      typeof work.noEpisodes === "undefined"
                    ) {
                      return
                    }
                    return {
                      annictId: work.annictId,
                      malId: work.malAnimeId,
                      title: work.title,
                      noEpisodes: work.noEpisodes,
                      watchedEpisodeCount:
                        work?.episodes?.nodes?.filter(
                          (episode) => episode?.viewerDidTrack
                        ).length ?? 0,
                      status,
                    }
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
          setDiffs(diffs)
          setChecks(new Set(diffs.map(({ work }) => work.annictId)))
          setMissingWorks(missingWorks)
        } finally {
          setIsFetching(false)
          abortRef.current = false
        }
      }}
    >
      {!isFetching ? "Prepare to sync" : "Abort"}
    </Button>
  )
}
