import { Anchor, List, Table, Text } from "@mantine/core"
import React from "react"
import { useCallback } from "react"
import {
  TargetService,
  TARGET_SERVICE_ANILIST,
  TARGET_SERVICE_MAL,
  TARGET_SERVICE_NAMES,
  WATCH_STATUS_MAP,
} from "../constants"
import { AnimeWork } from "../types"

export const MissingWorkTable = ({
  works,
  targetService,
}: {
  works: AnimeWork[]
  targetService: TargetService
}) => {
  const getSearchPage = useCallback(
    (term: string) => {
      switch (targetService) {
        case TARGET_SERVICE_MAL:
          return `https://myanimelist.net/search/all?q=${encodeURIComponent(
            term
          )}&cat=all`
        case TARGET_SERVICE_ANILIST:
          return `https://anilist.co/search/anime?search=${encodeURIComponent(
            term
          )}`
        default:
          break
      }
    },
    [targetService]
  )
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
              <Text size="sm">
                Search in {TARGET_SERVICE_NAMES[targetService]}:
              </Text>
              <List size="sm" withPadding>
                <List.Item>
                  <Anchor
                    href={getSearchPage(work.title)}
                    target="_blank"
                    size="sm"
                  >
                    {work.title}
                  </Anchor>
                </List.Item>
                {work.titleEn && (
                  <List.Item>
                    <Anchor
                      href={getSearchPage(work.titleEn)}
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
                      href={getSearchPage(work.titleRo)}
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
