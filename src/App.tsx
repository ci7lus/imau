import {
  MantineProvider,
  Header,
  Container,
  NormalizeCSS,
  GlobalStyles,
  Text,
  Space,
  Anchor,
} from "@mantine/core"
import { QueryClientProvider } from "react-query"
import { Main } from "./components/Main"
import { queryClient } from "./query"

export const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <MantineProvider theme={{ colorScheme: "dark" }}>
        <NormalizeCSS />
        <GlobalStyles />
        <Header height={60} padding="md">
          <Container>
            <Anchor href="/">
              <Text size="lg">imau</Text>
            </Anchor>
          </Container>
        </Header>
        <Container>
          <Space h="md" />
          <Main />
        </Container>
      </MantineProvider>
    </QueryClientProvider>
  )
}
