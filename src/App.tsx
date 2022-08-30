import {
  MantineProvider,
  Container,
  Text,
  Space,
  Anchor,
  Center,
} from "@mantine/core"
import { QueryClientProvider } from "react-query"
import { Main } from "./components/Main"
import { queryClient } from "./query"

export const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <MantineProvider
        withGlobalStyles
        withNormalizeCSS
        theme={{ colorScheme: "dark" }}
      >
        <Container>
          <Space h="xl" />
          <Main />
        </Container>
        <Space h="md" />
        <Container>
          <Center>
            <Text size="sm">
              imau made with ❤️ by{" "}
              <Anchor
                size="sm"
                href="https://myanimelist.net/profile/kanoshiho"
                target="_blank"
              >
                @kanoshiho@myanimelist.net
              </Anchor>{" "}
              (
              <Anchor
                size="sm"
                href="https://anilist.co/user/neneka/"
                target="_blank"
              >
                @neneka@anilist.co
              </Anchor>
              ).
            </Text>
            <Anchor
              ml="xs"
              size="sm"
              href="https://github.com/ci7lus/imau"
              target="_blank"
            >
              Source code
            </Anchor>
          </Center>
          <Space h="md" />
        </Container>
      </MantineProvider>
    </QueryClientProvider>
  )
}
