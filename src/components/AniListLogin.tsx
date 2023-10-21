import { Button, SimpleGrid } from "@mantine/core"
import { useMemo } from "react"
import React from "react"
import { AniListUserInfo } from "./AniListUserInfo"
import { generateRandomString } from "../utils"

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
    const ANILIST_REDIRECT_URL = import.meta.env.VITE_ANILIST_REDIRECT_URL
    if (
      typeof ANILIST_CLIENT_ID !== "string" ||
      typeof ANILIST_REDIRECT_URL !== "string"
    ) {
      return
    }
    const challenge = generateRandomString(50)
    const state = generateRandomString(10)
    document.cookie = `challlange=${challenge}`
    sessionStorage.setItem(state, challenge)
    const url = new URL("https://anilist.co/api/v2/oauth/authorize")
    url.searchParams.set("client_id", ANILIST_CLIENT_ID)
    url.searchParams.set("response_type", "code")
    url.searchParams.set("state", state)
    url.searchParams.set("code_challenge", challenge)
    url.searchParams.set("code_challenge_method", "plain")
    url.searchParams.set("redirect_uri", ANILIST_REDIRECT_URL)
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
