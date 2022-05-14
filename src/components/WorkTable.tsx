import { Anchor, Checkbox, Table, Text } from "@mantine/core"
import { WATCH_STATUS_MAP } from "../constants"
import { AnimeWork } from "../types"

export const WorkTable = ({
  works,
  checks,
  setChecks,
}: {
  works: AnimeWork[]
  checks: Set<number>
  setChecks: React.Dispatch<React.SetStateAction<Set<number>>>
}) => {
  return (
    <Table>
      <thead>
        <tr>
          <th>Include?</th>
          <th>Title</th>
          <th>Watched episodes</th>
          <th>Status</th>
          <th>MAL ID</th>
        </tr>
      </thead>
      <tbody>
        {works.map((work) => (
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
                {work.title}
              </Anchor>
            </td>
            <td>
              {work.noEpisodes ? (
                <Text size="sm" color="gray">
                  No episodes
                </Text>
              ) : (
                work.watchedEpisodeCount
              )}
            </td>
            <td>{WATCH_STATUS_MAP[work.status]}</td>
            <td>
              {work.malId ? (
                <Anchor
                  href={`https://myanimelist.net/anime/${work.malId}`}
                  target="_blank"
                >
                  {work.malId}
                </Anchor>
              ) : (
                <Anchor
                  href={`https://myanimelist.net/search/all?q=${encodeURIComponent(
                    work.title
                  )}&cat=all`}
                  target="_blank"
                  color="pink"
                >
                  Search in MAL
                </Anchor>
              )}
            </td>
          </tr>
        ))}
      </tbody>
    </Table>
  )
}
