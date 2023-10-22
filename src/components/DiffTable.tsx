import { ActionIcon, Anchor, Checkbox, Table, Text } from "@mantine/core"
import { useCallback, useMemo, useState } from "react"
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
  const [keepsInSort, setKeepsInSort] = useState(new Set<number>())
  const sortedMemo = useMemo(
    () =>
      diffs.sort((_, b) =>
        ignores.includes(b.work.annictId) && !keepsInSort.has(b.work.annictId)
          ? -1
          : 0
      ),
    [diffs, ignores, keepsInSort]
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
      <Table.Thead>
        <Table.Tr>
          <Table.Th>Include?</Table.Th>
          <Table.Th>Title</Table.Th>
          <Table.Th>Annict</Table.Th>
          <Table.Th>{TARGET_SERVICE_NAMES[targetService]}</Table.Th>
          <Table.Th>Ignore</Table.Th>
        </Table.Tr>
      </Table.Thead>
      <Table.Tbody>
        {sortedMemo.map(({ work, target }) => (
          <Table.Tr
            key={work.annictId}
            style={{
              opacity: ignores.includes(work.annictId) ? 0.5 : undefined,
            }}
          >
            <Table.Td>
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
            </Table.Td>
            <Table.Td>
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
            </Table.Td>
            <Table.Td>
              <Text>
                {WATCH_STATUS_MAP[work.status]}
                {!work.noEpisodes && ` (${work.watchedEpisodeCount})`}
              </Text>
            </Table.Td>
            <Table.Td>
              {target ? (
                <Text>
                  {`${WATCH_STATUS_MAP[target.status]} (${
                    target.watchedEpisodeCount
                  })`}
                </Text>
              ) : (
                <Text size="sm" c="gray">
                  No status
                </Text>
              )}
            </Table.Td>
            <Table.Td>
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
                    setKeepsInSort((ignores) => {
                      const copiedIgnores = new Set(ignores)
                      copiedIgnores.add(work.annictId)
                      return copiedIgnores
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
            </Table.Td>
          </Table.Tr>
        ))}
      </Table.Tbody>
    </Table>
  )
}
