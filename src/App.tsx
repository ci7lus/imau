import { MantineProvider, Container, Text, Space, Anchor } from "@mantine/core"
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
          <Text size="sm">imau made with ❤️.</Text>
          <Anchor
            size="sm"
            href="https://github.com/ci7lus/imau"
            target="_blank"
          >
            Source code
          </Anchor>
          <Space h="md" />
        </Container>
      </MantineProvider>
    </QueryClientProvider>
  )
}
