import { Anchor, Space, Text, Title } from "@mantine/core"

export const FirstView = () => {
  return (
    <>
      <Title order={1}>imau</Title>
      <Space h="xs" />
      <Text size="lg">
        Sync your viewing status from{" "}
        <Anchor href="https://annict.com" target="_blank" size="lg">
          Annict
        </Anchor>{" "}
        to{" "}
        <Anchor href="https://myanimelist.net" target="_blank" size="lg">
          MAL
        </Anchor>
        {" / "}
        <Anchor href="https://anilist.co" target="_blank" size="lg">
          AniList
        </Anchor>{" "}
        to play{" "}
        <Anchor href="https://animemusicquiz.com/" target="_blank" size="lg">
          AMQ
        </Anchor>
        .
      </Text>
    </>
  )
}
