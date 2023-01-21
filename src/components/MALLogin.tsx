import { Button, SimpleGrid } from "@mantine/core"
import { useMemo } from "react"
import { MALUserInfo } from "./MALUserInfo"
import { generateRandomString } from "../utils"

export const MALLogin = ({
  malAccessToken,
  setMalConnected,
}: {
  malAccessToken: string
  setMalAccessToken: (s: string) => void
  setMalConnected: (s: boolean) => void
}) => {
  const authUrl = useMemo(() => {
    const MAL_CLIENT_ID = import.meta.env.VITE_MAL_CLIENT_ID
    const MAL_REDIRECT_URL = import.meta.env.VITE_MAL_REDIRECT_URL
    if (
      typeof MAL_CLIENT_ID !== "string" ||
      typeof MAL_REDIRECT_URL !== "string"
    ) {
      return
    }
    const challenge = generateRandomString(50)
    const state = generateRandomString(10)
    document.cookie = `challlange=${challenge}`
    sessionStorage.setItem(state, challenge)
    const url = new URL("https://myanimelist.net/v1/oauth2/authorize")
    url.searchParams.set("client_id", MAL_CLIENT_ID)
    url.searchParams.set("response_type", "code")
    url.searchParams.set("state", state)
    url.searchParams.set("code_challenge", challenge)
    url.searchParams.set("code_challenge_method", "plain")
    url.searchParams.set("redirect_uri", MAL_REDIRECT_URL)
    return url.href
  }, [])

  return (
    <SimpleGrid>
      <Button component="a" href={authUrl} color="blue">
        {malAccessToken && "(Re)"}Login with MAL
      </Button>
      {malAccessToken && (
        <MALUserInfo
          malAccessToken={malAccessToken}
          setMalConnected={setMalConnected}
        />
      )}
    </SimpleGrid>
  )
}
