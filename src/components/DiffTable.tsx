import { Anchor, Checkbox, Table, Text } from "@mantine/core"
import { WATCH_STATUS_MAP } from "../constants"
import { MAL_TO_ANNICT_STATUS_MAP } from "../mal"
import { StatusDiff } from "../types"

export const DiffTable = ({
  diffs,
  checks,
  setChecks,
}: {
  diffs: StatusDiff[]
  checks: Set<number>
  setChecks: React.Dispatch<React.SetStateAction<Set<number>>>
}) => {
  return (
    <Table striped highlightOnHover>
      <thead>
        <tr>
          <th>Include?</th>
          <th>Title</th>
          <th>Annict</th>
          <th>MAL</th>
        </tr>
      </thead>
      <tbody>
        {diffs.map(({ work, mal }) => (
          <tr key={work.annictId}>
            <td>
              <Checkbox
                checked={checks.has(work.annictId)}
                onClick={() => {
                  const isChecked = checks.has(work.annictId)
                  setChecks((checks) => {
                    const copiedChecks = new Set(checks)
                    if (isChecked) {
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
          </tr>
        ))}
      </tbody>
    </Table>
  )
}
