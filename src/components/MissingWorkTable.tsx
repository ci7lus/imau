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
      <Table.Thead>
        <Table.Tr>
          <Table.Th>Title</Table.Th>
          <Table.Th>Status</Table.Th>
        </Table.Tr>
      </Table.Thead>
      <Table.Tbody>
        {works.map((work) => (
          <Table.Tr key={work.annictId}>
            <Table.Td>
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
            </Table.Td>
            <Table.Td>
              <Text>
                {WATCH_STATUS_MAP[work.status]}
                {!work.noEpisodes && ` (${work.watchedEpisodeCount})`}
              </Text>
            </Table.Td>
          </Table.Tr>
        ))}
      </Table.Tbody>
    </Table>
  )
}
