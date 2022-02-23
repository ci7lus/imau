import { Button } from "@mantine/core"
import { useRef, useState } from "react"
import { generateGqlClient } from "../annictApiEntry"
import { queryLibraryQuery, StatusState } from "../annictGql"
import { WATCH_STATUS_MAP } from "../constants"
import { AnimeWork } from "../types"

export const LibraryFetchButton = ({
  annictAccessToken,
  targetStatus,
  isEveryChecked,
  setWorks,
  setChecks,
}: {
  annictAccessToken: string
  targetStatus: StatusState
  isEveryChecked: boolean
  setWorks: React.Dispatch<React.SetStateAction<Map<number, AnimeWork>>>
  setChecks: React.Dispatch<React.SetStateAction<Set<number>>>
}) => {
  const sdk = generateGqlClient(annictAccessToken)
  const [isFetching, setIsFetching] = useState(false)
  const abortRef = useRef(false)

  return (
    <Button
      color={isFetching ? "gray" : "primary"}
      //disabled={isFetching}
      onClick={async () => {
        if (isFetching) {
          abortRef.current = true
          return
        }
        setIsFetching(true)
        let after: string | null = null
        try {
          // eslint-disable-next-line no-constant-condition
          while (true) {
            // TODO: なんでここ型が必要なんだろう(afterの代入をすると変になる)
            const result: queryLibraryQuery = await sdk.queryLibrary({
              state: targetStatus,
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
                    status: targetStatus,
                  }
                })
                .filter((work): work is AnimeWork => !!work) || []
            const isEveryCheckedCache = !!isEveryChecked
            setWorks((works) => {
              const copiedWorks = new Map(works)
              structedWorks.forEach((work) => {
                copiedWorks.set(work.annictId, work)
              })
              return copiedWorks
            })
            if (isEveryCheckedCache) {
              setChecks((checks) => {
                const copiedChecks = new Set(checks)
                structedWorks.forEach((work) => {
                  copiedChecks.add(work.annictId)
                })
                return copiedChecks
              })
            }
            after = result.viewer?.works?.pageInfo.endCursor || null
            if (!after || abortRef.current) {
              break
            }
          }
        } finally {
          setIsFetching(false)
          abortRef.current = false
        }
      }}
    >
      Fetch {WATCH_STATUS_MAP[targetStatus]}
    </Button>
  )
}
