import { Anchor, Button, Center, Progress, Space, Text } from "@mantine/core"
import { useState } from "react"
import { StatusState } from "../annictGql"
import { ANNICT_TO_MAL_STATUS_MAP, MALAPI } from "../mal"
import { AnimeWork, StatusDiff } from "../types"
import { sleep } from "../utils"

export const DoSync = ({
  checks,
  setChecks,
  diffs,
  malAccessToken,
}: {
  checks: number[]
  setChecks: React.Dispatch<React.SetStateAction<Set<number>>>
  diffs: StatusDiff[]
  malAccessToken: string
}) => {
  const [isStarted, setIsStarted] = useState(false)
  const [successCount, setSuccessCount] = useState(0)
  const [failedCount, setFailedCount] = useState(0)
  const success = (successCount / checks.length) * 100
  const failed = (failedCount / checks.length) * 100
  const [failedWorks, setFailedWorks] = useState<AnimeWork[]>([])
  const [processing, setProcessing] = useState<AnimeWork | null>(null)
  const mal = new MALAPI(malAccessToken)
  return (
    <>
      <Center>
        <Button
          color={checks.length === 0 || isStarted ? "gray" : "primary"}
          onClick={async () => {
            if (isStarted) {
              return
            }
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
              if (!work.malId) {
                setSuccessCount((i) => i + 1)
                continue
              }
              setProcessing(work)
              try {
                await mal.updateAnimeStatus({
                  id: work.malId,
                  status: ANNICT_TO_MAL_STATUS_MAP[work.status],
                  num_watched_episodes: work.noEpisodes
                    ? work.status === StatusState.WATCHED
                      ? 1
                      : undefined
                    : work.watchedEpisodeCount,
                })
                await sleep(500)
                setSuccessCount((i) => i + 1)
                setChecks((checks) => {
                  const copied = Object.assign([], checks)
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
              href={`https://myanimelist.net/anime/${work.malId}`}
            >
              <Text>{work.title}</Text>
            </Anchor>
          ))}
        </>
      )}
    </>
  )
}
