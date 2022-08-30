import { Anchor, Button, Center, Progress, Space, Text } from "@mantine/core"
import { useState } from "react"
import { ANNICT_TO_ANILIST_STATUS_MAP } from "../aniList"
import { generateGqlClient } from "../aniListApiEntry"
import { StatusState } from "../annictGql"
import {
  TARGET_SERVICE_URLS,
  TargetService,
  TARGET_SERVICE_MAL,
  TARGET_SERVICE_ANILIST,
} from "../constants"
import { ANNICT_TO_MAL_STATUS_MAP, MALAPI } from "../mal"
import { AnimeWork, StatusDiff } from "../types"
import { sleep } from "../utils"

export const DoSync = ({
  checks,
  setChecks,
  diffs,
  targetService,
  targetAccessToken,
  disabled,
}: {
  checks: number[]
  setChecks: React.Dispatch<React.SetStateAction<Set<number>>>
  diffs: StatusDiff[]
  targetService: TargetService
  targetAccessToken: string
  disabled: boolean
}) => {
  const [isStarted, setIsStarted] = useState(false)
  const [checkCountOnStart, setCheckCountOnStart] = useState(checks.length)
  const [successCount, setSuccessCount] = useState(0)
  const [failedCount, setFailedCount] = useState(0)
  const success = (successCount / checkCountOnStart) * 100
  const failed = (failedCount / checkCountOnStart) * 100
  const [failedWorks, setFailedWorks] = useState<AnimeWork[]>([])
  const [processing, setProcessing] = useState<AnimeWork | null>(null)
  const mal = new MALAPI(targetAccessToken)
  const aniList = generateGqlClient(targetAccessToken)
  return (
    <>
      <Center>
        <Button
          disabled={disabled}
          color={checks.length === 0 || isStarted ? "gray" : "primary"}
          onClick={async () => {
            if (isStarted) {
              return
            }
            setCheckCountOnStart(checks.length)
            setSuccessCount(0)
            setFailedCount(0)
            setFailedWorks([])
            setIsStarted(true)
            for (const annictId of checks) {
              const diff = diffs.find(({ work }) => work.annictId === annictId)
              if (!diff) {
                continue
              }
              const { work } = diff
              setProcessing(work)
              try {
                if (targetService === TARGET_SERVICE_MAL && work.malId) {
                  if (work.status === StatusState.NO_STATE) {
                    await mal.deleteAnimeStatus({ id: work.malId })
                  } else {
                    await mal.updateAnimeStatus({
                      id: work.malId,
                      status: ANNICT_TO_MAL_STATUS_MAP[work.status],
                      num_watched_episodes: work.noEpisodes
                        ? work.status === StatusState.WATCHED
                          ? 1
                          : undefined
                        : work.watchedEpisodeCount,
                    })
                  }
                } else if (
                  targetService === TARGET_SERVICE_ANILIST &&
                  work.aniListId
                ) {
                  const aniListId = parseInt(work.aniListId)
                  if (work.status === StatusState.NO_STATE) {
                    await aniList.deleteMediaStatus({ id: aniListId })
                  } else {
                    await aniList.updateMediaStatus({
                      id: aniListId,
                      status: ANNICT_TO_ANILIST_STATUS_MAP[work.status],
                      numWatchedEpisodes: work.noEpisodes
                        ? work.status === StatusState.WATCHED
                          ? 1
                          : null
                        : work.watchedEpisodeCount,
                      priority: null,
                    })
                  }
                } else {
                  setProcessing(null)
                  setSuccessCount((i) => i + 1)
                  continue
                }

                await sleep(500)
                setSuccessCount((i) => i + 1)
                setChecks((checks) => {
                  const copied = new Set(checks)
                  copied.delete(work.annictId)
                  return copied
                })
              } catch (error) {
                console.error(error)
                setFailedWorks((works) => [...works, work])
                setFailedCount((i) => i + 1)
                await sleep(500)
              }
            }
            setProcessing(null)
            setIsStarted(false)
          }}
        >
          Sync
        </Button>
      </Center>
      <Space h="md" />
      {isStarted && (
        <Progress
          size="xl"
          sections={[
            { value: success, color: "blue" },
            { value: failed, color: "red" },
          ]}
          animate
          striped
        ></Progress>
      )}
      {processing && (
        <>
          <Space h="sm" />
          <Center>{processing.title}</Center>
        </>
      )}
      {!processing && 0 < failedWorks.length && (
        <>
          <Space h="sm" />
          {failedWorks.map((work) => (
            <Anchor
              key={work.annictId}
              href={`${TARGET_SERVICE_URLS[targetService]}${work.malId}`}
            >
              <Text>{work.title}</Text>
            </Anchor>
          ))}
        </>
      )}
    </>
  )
}
