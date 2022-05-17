import { Anchor, Table, Text } from "@mantine/core"
import { WATCH_STATUS_MAP } from "../constants"
import { AnimeWork } from "../types"

export const MissingWorkTable = ({ works }: { works: AnimeWork[] }) => {
  return (
    <Table>
      <thead>
        <tr>
          <th>Title</th>
          <th>Status</th>
        </tr>
      </thead>
      <tbody>
        {Array.from(works.values()).map((work) => (
          <tr key={work.annictId}>
            <td>
              <Anchor
                href={`https://annict.com/works/${work.annictId}`}
                target="_blank"
              >
                {`${work.title} (${work.annictId})`}
              </Anchor>
              <br />
              <Anchor
                href={`https://myanimelist.net/search/all?q=${encodeURIComponent(
                  work.title
                )}&cat=all`}
                target="_blank"
                color="pink"
                size="sm"
              >
                Search in MAL
              </Anchor>
            </td>
            <td>
              <Text>
                {WATCH_STATUS_MAP[work.status]}
                {!work.noEpisodes && ` (${work.watchedEpisodeCount})`}
              </Text>
            </td>
          </tr>
        ))}
      </tbody>
    </Table>
  )
}
