import {
  Center,
  SegmentedControl,
  SimpleGrid,
  Space,
  Text,
} from "@mantine/core"
import { useLocalStorageValue } from "@mantine/hooks"
import { useState } from "react"
import {
  TARGET_SERVICE_ANILIST,
  TARGET_SERVICE_MAL,
  TARGET_SERVICE_NAMES,
  TargetService,
} from "../constants"
import { AniListLogin } from "./AniListLogin"
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
  const [aniListAccessToken, setAniListAccessToken] =
    useLocalStorageValue<string>({
      key: "ANILIST_ACCESS_TOKEN",
      defaultValue: "",
    })
  const [annictConnected, setAnnictConnected] = useState(false)
  const [malConnected, setMalConnected] = useState(false)
  const [aniListConnected, setAniListConnected] = useState(false)
  const [target, setTarget] = useLocalStorageValue<TargetService>({
    key: "TARGET_SERVICE",
    defaultValue: TARGET_SERVICE_MAL,
  })
  const targetConnected =
    target === TARGET_SERVICE_MAL ? malConnected : aniListConnected
  const targetAccessToken =
    target === TARGET_SERVICE_MAL ? malAccessToken : aniListAccessToken
  return (
    <>
      <FirstView />
      <Space h="md" />
      <Center>
        <SegmentedControl
          value={target}
          onChange={(s) => setTarget(s as TargetService)}
          data={[
            {
              label: TARGET_SERVICE_NAMES[TARGET_SERVICE_MAL],
              value: TARGET_SERVICE_MAL,
            },
            {
              label: TARGET_SERVICE_NAMES[TARGET_SERVICE_ANILIST],
              value: TARGET_SERVICE_ANILIST,
            },
          ]}
        />
      </Center>
      <Space h="md" />
      <SimpleGrid spacing="md" cols={2}>
        <AnnictLogin
          annictToken={annictToken}
          setAnnictToken={setAnnictToken}
          setAnnictConnected={setAnnictConnected}
        />
        {target === TARGET_SERVICE_MAL && (
          <MALLogin
            malAccessToken={malAccessToken}
            setMalAccessToken={setMalAccessToken}
            setMalConnected={setMalConnected}
          />
        )}
        {target === TARGET_SERVICE_ANILIST && (
          <AniListLogin
            aniListAccessToken={aniListAccessToken}
            setAniListAccessToken={setAniListAccessToken}
            setAniListConnected={setAniListConnected}
          />
        )}
      </SimpleGrid>
      <Space h="lg" />
      {annictConnected && targetConnected ? (
        <CheckDiff
          annictAccessToken={annictToken}
          targetService={target}
          targetAccessToken={targetAccessToken}
        />
      ) : (
        <Center m="lg">
          <Text>Connect with both Annict and MAL/AniList!</Text>
        </Center>
      )}
    </>
  )
}
