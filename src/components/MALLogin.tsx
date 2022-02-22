import { Button, SimpleGrid } from "@mantine/core"
import { useLocalStorageValue } from "@mantine/hooks"
import axios from "axios"
import { useEffect, useMemo } from "react"
import { generateRandomString } from "../utils"
import { MALUserInfo } from "./MALUserInfo"

export const MALLogin = ({
  malAccessToken,
  setMalAccessToken,
}: {
  malAccessToken: string
  setMalAccessToken: (s: string) => void
}) => {
  const [redirectUrl, setRedirectUrl] = useLocalStorageValue({
    key: "MAL_REDIRECT_URL",
    defaultValue: "" as string,
  })
  const authUrl = useMemo(() => {
    if (location.search.includes("callback=")) {
      return
    }
    if (typeof import.meta.env.VITE_MAL_CLIENT_ID !== "string") {
      return
    }
    const challenge = generateRandomString(50)
    const state = generateRandomString(10)
    sessionStorage.setItem(state, challenge)
    const url = new URL("https://myanimelist.net/v1/oauth2/authorize")
    url.searchParams.set(
      "client_id",
      import.meta.env.VITE_MAL_CLIENT_ID as string
    )
    url.searchParams.set("response_type", "code")
    url.searchParams.set("state", state)
    url.searchParams.set("code_challenge", challenge)
    url.searchParams.set("code_challenge_method", "plain")
    const redirectUrl = new URL(location.href)
    for (const param of ["code", "state"]) {
      redirectUrl.searchParams.delete(param)
    }
    redirectUrl.searchParams.set("callback", "mal")
    url.searchParams.set("redirect_uri", redirectUrl.href)
    setRedirectUrl(redirectUrl.href)
    return url.href
  }, [])
  useEffect(() => {
    const url = new URL(location.href)
    if (url.searchParams.get("callback") !== "mal") {
      return
    }
    const code = url.searchParams.get("code")
    const state = url.searchParams.get("state")
    if (!code || !state) {
      return
    }
    const challange = sessionStorage.getItem(state)
    if (!challange) {
      return
    }
    axios
      .post<{ access_token: string }>(
        "/mal_v1/oauth2/token",
        Object.entries({
          grant_type: "authorization_code",
          code,
          client_id: import.meta.env.VITE_MAL_CLIENT_ID,
          client_secret: import.meta.env.VITE_MAL_CLIENT_SECRET,
          redirect_uri: redirectUrl,
          code_verifier: challange,
        })
          .map(([k, v]) => [k, v].join("="))
          .join("&"),
        { headers: { "Content-Type": "application/x-www-form-urlencoded" } }
      )
      .then((data) => {
        setMalAccessToken(data.data.access_token)
        history.replaceState({}, document.title, "/")
      })
  }, [])

  return (
    <SimpleGrid>
      <Button component="a" href={authUrl} color="pink">
        {malAccessToken && "(Re)"}Login with MAL
      </Button>
      {malAccessToken && <MALUserInfo malAccessToken={malAccessToken} />}
    </SimpleGrid>
  )
}
