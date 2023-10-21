import { ActionIcon, Anchor, Checkbox, Table, Text } from "@mantine/core"
import { useCallback, useMemo } from "react"
import React from "react"
import { Forbid } from "tabler-icons-react"
import {
  TARGET_SERVICE_NAMES,
  TARGET_SERVICE_URLS,
  TargetService,
  WATCH_STATUS_MAP,
  TARGET_SERVICE_MAL,
  TARGET_SERVICE_ANILIST,
} from "../constants"
import { AnimeWork, StatusDiff } from "../types"

export const DiffTable = ({
  diffs,
  checks,
  setChecks,
  ignores,
  setIgnores,
  targetService,
}: {
  diffs: StatusDiff[]
  checks: Set<number>
  setChecks: React.Dispatch<React.SetStateAction<Set<number>>>
  ignores: number[]
  setIgnores: React.Dispatch<React.SetStateAction<number[]>>
  targetService: TargetService
}) => {
  const sortedMemo = useMemo(
    () => diffs.sort((_, b) => (ignores.includes(b.work.annictId) ? -1 : 0)),
    [diffs, ignores]
  )
  const getRelationId = useCallback(
    (work: AnimeWork) => {
      if (targetService === TARGET_SERVICE_MAL) {
        return work.malId
      } else if (targetService === TARGET_SERVICE_ANILIST) {
        return work.aniListId
      }
    },
    [targetService]
  )
  return (
    <Table striped highlightOnHover>
      <thead>
        <tr>
          <th>Include?</th>
          <th>Title</th>
          <th>Annict</th>
          <th>{TARGET_SERVICE_NAMES[targetService]}</th>
          <th>Ignore</th>
        </tr>
      </thead>
      <tbody>
        {sortedMemo.map(({ work, target }) => (
          <tr
            key={work.annictId}
            style={{
              opacity: ignores.includes(work.annictId) ? 0.5 : undefined,
            }}
          >
            <td>
              <Checkbox
                checked={checks.has(work.annictId)}
                onClick={() => {
                  setChecks((checks) => {
                    const copiedChecks = new Set(checks)
                    if (checks.has(work.annictId)) {
                      copiedChecks.delete(work.annictId)
                    } else {
                      copiedChecks.add(work.annictId)
                    }
                    return copiedChecks
                  })
                }}
                readOnly={true}
              />
            </td>
            <td>
              <Anchor
                href={`https://annict.com/works/${work.annictId}`}
                target="_blank"
              >
                {`${work.title} (${work.annictId})`}
              </Anchor>

              <>
                <br />
                <Anchor
                  href={`${TARGET_SERVICE_URLS[targetService]}${getRelationId(
                    work
                  )}`}
                  target="_blank"
                  size="sm"
                >
                  {target
                    ? `${target.title} (${getRelationId(work)})`
                    : `${TARGET_SERVICE_URLS[targetService]}${getRelationId(
                        work
                      )}`}
                </Anchor>
              </>
            </td>
            <td>
              <Text>
                {WATCH_STATUS_MAP[work.status]}
                {!work.noEpisodes && ` (${work.watchedEpisodeCount})`}
              </Text>
            </td>
            <td>
              <Text>
                {target ? (
                  `${WATCH_STATUS_MAP[target.status]} (${
                    target.watchedEpisodeCount
                  })`
                ) : (
                  <Text size="sm" color="gray">
                    No status
                  </Text>
                )}
              </Text>
            </td>
            <td>
              <ActionIcon
                title="Ignore this entry"
                onClick={() => {
                  setIgnores((ignores) => {
                    const includes = ignores.includes(work.annictId)
                    setChecks((checks) => {
                      const copiedChecks = new Set(checks)
                      if (checks.has(work.annictId) && !includes) {
                        copiedChecks.delete(work.annictId)
                      } else if (includes) {
                        copiedChecks.add(work.annictId)
                      }
                      return copiedChecks
                    })
                    return includes
                      ? ignores.filter((ignore) => ignore !== work.annictId)
                      : [...ignores, work.annictId]
                  })
                }}
                size="lg"
                color={ignores.includes(work.annictId) ? "red" : "gray"}
              >
                <Forbid />
              </ActionIcon>
            </td>
          </tr>
        ))}
      </tbody>
    </Table>
  )
}
