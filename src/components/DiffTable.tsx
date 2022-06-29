import { ActionIcon, Anchor, Checkbox, Table, Text } from "@mantine/core"
import { useMemo } from "react"
import { Forbid } from "tabler-icons-react"
import { WATCH_STATUS_MAP } from "../constants"
import { MAL_TO_ANNICT_STATUS_MAP } from "../mal"
import { StatusDiff } from "../types"

export const DiffTable = ({
  diffs,
  checks,
  setChecks,
  ignores,
  setIgnores,
}: {
  diffs: StatusDiff[]
  checks: Set<number>
  setChecks: React.Dispatch<React.SetStateAction<Set<number>>>
  ignores: number[]
  setIgnores: React.Dispatch<React.SetStateAction<number[]>>
}) => {
  const sortedMemo = useMemo(
    () => diffs.sort((_, b) => (ignores.includes(b.work.annictId) ? -1 : 0)),
    [diffs]
  )
  return (
    <Table striped highlightOnHover>
      <thead>
        <tr>
          <th>Include?</th>
          <th>Title</th>
          <th>Annict</th>
          <th>MAL</th>
          <th>Ignore</th>
        </tr>
      </thead>
      <tbody>
        {sortedMemo.map(({ work, mal }) => (
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
                  href={`https://myanimelist.net/anime/${work.malId}`}
                  target="_blank"
                  size="sm"
                >
                  {mal
                    ? `${mal?.title} (${work.malId})`
                    : `https://myanimelist.net/anime/${work.malId}`}
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
                {mal ? (
                  `${WATCH_STATUS_MAP[MAL_TO_ANNICT_STATUS_MAP[mal.status]]} (${
                    mal.watchedEpisodeCount
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
