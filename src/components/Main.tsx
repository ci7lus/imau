import { Center, SimpleGrid, Space, Text } from "@mantine/core"
import { useLocalStorageValue } from "@mantine/hooks"
import { useState } from "react"
import { AnnictLogin } from "./AnnictLogin"
import { CheckDiff } from "./CheckDiff"
import { FirstView } from "./FirstView"
import { MALLogin } from "./MALLogin"

export const Main = () => {
  const [annictToken, setAnnictToken] = useLocalStorageValue<string>({
    key: "ANNICT_ACCESS_TOKEN",
    defaultValue: "",
  })
  const [malAccessToken, setMalAccessToken] = useLocalStorageValue<string>({
    key: "MAL_ACCESS_TOKEN",
    defaultValue: "",
  })
  const [annictConnected, setAnnictConnected] = useState(false)
  const [malConnected, setMalConnected] = useState(false)
  return (
    <>
      <FirstView />
      <Space h="md" />
      <SimpleGrid spacing="md" cols={2}>
        <AnnictLogin
          annictToken={annictToken}
          setAnnictToken={setAnnictToken}
          setAnnictConnected={setAnnictConnected}
        />
        <MALLogin
          malAccessToken={malAccessToken}
          setMalAccessToken={setMalAccessToken}
          setMalConnected={setMalConnected}
        ></MALLogin>
      </SimpleGrid>
      <Space h="lg" />
      {annictConnected && malConnected ? (
        <CheckDiff
          annictAccessToken={annictToken}
          malAccessToken={malAccessToken}
        />
      ) : (
        <Center m="lg">
          <Text>Connect with both Annit and MAL!</Text>
        </Center>
      )}
    </>
  )
}
