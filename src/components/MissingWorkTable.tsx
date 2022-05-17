import { Anchor, List, Table, Text } from "@mantine/core"
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
        {works.map((work) => (
          <tr key={work.annictId}>
            <td>
              <Anchor
                href={`https://annict.com/works/${work.annictId}`}
                target="_blank"
              >
                {`${work.title} (${work.annictId})`}
              </Anchor>
              <br />
              <Text size="sm">Search in MAL:</Text>
              <List size="sm" withPadding>
                <List.Item>
                  <Anchor
                    href={`https://myanimelist.net/search/all?q=${encodeURIComponent(
                      work.title
                    )}&cat=all`}
                    target="_blank"
                    size="sm"
                  >
                    {work.title}
                  </Anchor>
                </List.Item>
                {work.titleEn && (
                  <List.Item>
                    <Anchor
                      href={`https://myanimelist.net/search/all?q=${encodeURIComponent(
                        work.titleEn
                      )}&cat=all`}
                      target="_blank"
                      size="sm"
                    >
                      {work.titleEn}
                    </Anchor>
                  </List.Item>
                )}
                {work.titleRo && (
                  <List.Item>
                    <Anchor
                      href={`https://myanimelist.net/search/all?q=${encodeURIComponent(
                        work.titleRo
                      )}&cat=all`}
                      target="_blank"
                      size="sm"
                    >
                      {work.titleRo}
                    </Anchor>
                  </List.Item>
                )}
              </List>
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
