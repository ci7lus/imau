import { Button, SimpleGrid } from "@mantine/core"
import { useMemo } from "react"
import { generateRandomString } from "../utils"
import { MALUserInfo } from "./MALUserInfo"

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
    const DEPLOY_PRIME_URL = import.meta.env.DEPLOY_PRIME_URL
    if (
      typeof MAL_CLIENT_ID !== "string" ||
      typeof DEPLOY_PRIME_URL !== "string"
    ) {
      return
    }
    const challenge = generateRandomString(50)
    const state = generateRandomString(10)
    // biome-ignore lint/suspicious/noDocumentCookie: cookie
    document.cookie = `challlange=${challenge}`
    sessionStorage.setItem(state, challenge)
    const url = new URL("https://myanimelist.net/v1/oauth2/authorize")
    url.searchParams.set("client_id", MAL_CLIENT_ID)
    url.searchParams.set("response_type", "code")
    url.searchParams.set("state", state)
    url.searchParams.set("code_challenge", challenge)
    url.searchParams.set("code_challenge_method", "plain")
    url.searchParams.set(
      "redirect_uri",
      `${DEPLOY_PRIME_URL}/.netlify/functions/mal-callback`
    )
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
