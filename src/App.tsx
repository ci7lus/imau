import {
  Anchor,
  Center,
  Container,
  MantineProvider,
  Space,
  Text,
} from "@mantine/core"
import { Notifications } from "@mantine/notifications"
import { QueryClientProvider } from "react-query"
import { Main } from "./components/Main"
import { queryClient } from "./query"
// eslint-disable-next-line import/no-unresolved
import "@mantine/core/styles.css"
// eslint-disable-next-line import/no-unresolved
import "@mantine/notifications/styles.css"

export const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <MantineProvider forceColorScheme="dark">
        <Notifications />
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
                href="https://annict.com/@kokoro"
                target="_blank"
              >
                @kokoro@annict.com
              </Anchor>{" "}
              (
              <Anchor
                size="sm"
                href="https://myanimelist.net/profile/kanoshiho"
                target="_blank"
              >
                @kanoshiho@myanimelist.net
              </Anchor>
              ,{" "}
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
