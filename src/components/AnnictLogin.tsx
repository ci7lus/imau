import { Button, SimpleGrid } from "@mantine/core"
import { useLocalStorageValue } from "@mantine/hooks"
import axios from "axios"
import { useEffect, useMemo } from "react"
import { AnnictUserInfo } from "./AnnictUserInfo"

export const AnnictLogin = ({
  annictToken,
  setAnnictToken,
}: {
  annictToken: string
  setAnnictToken: (s: string) => void
}) => {
  const [redirectUrl, setRedirectUrl] = useLocalStorageValue({
    key: "REDIRECT_URL",
    defaultValue: "" as string,
  })
  const authUrl = useMemo(() => {
    if (typeof import.meta.env.VITE_ANNICT_CLIENT_ID !== "string") {
      return
    }
    const url = new URL(
      "https://api.annict.com/oauth/authorize?response_type=code"
    )
    url.searchParams.set("client_id", import.meta.env.VITE_ANNICT_CLIENT_ID)
    const callbackUrl = new URL(location.href)
    for (const param of ["code", "state"]) {
      callbackUrl.searchParams.delete(param)
    }
    callbackUrl.searchParams.set("callback", "annict")
    url.searchParams.set("redirect_uri", callbackUrl.href)
    setRedirectUrl(callbackUrl.href)
    return url.href
  }, [])
  useEffect(() => {
    const url = new URL(location.href)
    if (url.searchParams.get("callback") !== "annict") {
      return
    }
    const code = url.searchParams.get("code")
    if (!code) {
      return
    }
    axios
      .post<{ access_token: string }>("https://api.annict.com/oauth/token", {
        grant_type: "authorization_code",
        code,
        client_id: import.meta.env.VITE_ANNICT_CLIENT_ID,
        client_secret: import.meta.env.VITE_ANNICT_CLIENT_SECRET,
        redirect_uri: redirectUrl,
      })
      .then((data) => {
        setAnnictToken(data.data.access_token)
        location.search = ""
      })
  }, [])

  return (
    <SimpleGrid>
      <Button component="a" href={authUrl} color="pink">
        {annictToken && "(Re)"}Login with Annict
      </Button>
      {annictToken && <AnnictUserInfo annictToken={annictToken} />}
    </SimpleGrid>
  )
}
