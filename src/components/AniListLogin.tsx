import { Button, SimpleGrid } from "@mantine/core"
import { useMemo } from "react"
import { generateRandomString } from "../utils"
import { AniListUserInfo } from "./AniListUserInfo"

export const AniListLogin = ({
  aniListAccessToken,
  setAniListConnected,
}: {
  aniListAccessToken: string
  setAniListAccessToken: (s: string) => void
  setAniListConnected: (s: boolean) => void
}) => {
  const authUrl = useMemo(() => {
    const ANILIST_CLIENT_ID = import.meta.env.VITE_ANILIST_CLIENT_ID
    const DEPLOY_PRIME_URL = import.meta.env.DEPLOY_PRIME_URL
    if (
      typeof ANILIST_CLIENT_ID !== "string" ||
      typeof DEPLOY_PRIME_URL !== "string"
    ) {
      return
    }
    const challenge = generateRandomString(50)
    const state = generateRandomString(10)
    // biome-ignore lint/suspicious/noDocumentCookie: cookie
    document.cookie = `challlange=${challenge}`
    sessionStorage.setItem(state, challenge)
    const url = new URL("https://anilist.co/api/v2/oauth/authorize")
    url.searchParams.set("client_id", ANILIST_CLIENT_ID)
    url.searchParams.set("response_type", "code")
    url.searchParams.set("state", state)
    url.searchParams.set("code_challenge", challenge)
    url.searchParams.set("code_challenge_method", "plain")
    url.searchParams.set(
      "redirect_uri",
      `${DEPLOY_PRIME_URL}/.netlify/functions/anilist-callback`
    )
    return url.href
  }, [])

  return (
    <SimpleGrid>
      <Button component="a" href={authUrl} color="blue">
        {aniListAccessToken && "(Re)"}Login with AniList
      </Button>
      {aniListAccessToken && (
        <AniListUserInfo
          aniListAccessToken={aniListAccessToken}
          setAniListConnected={setAniListConnected}
        />
      )}
    </SimpleGrid>
  )
}
