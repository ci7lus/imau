import { Button, SimpleGrid } from "@mantine/core"
import { useMemo } from "react"
import { isProduction } from "../utils"
import { AnnictUserInfo } from "./AnnictUserInfo"

export const AnnictLogin = ({
  annictToken,
  setAnnictConnected,
}: {
  annictToken: string
  setAnnictToken: (s: string) => void
  setAnnictConnected: (s: boolean) => void
}) => {
  const authUrl = useMemo(() => {
    const ANNICT_CLIENT_ID = import.meta.env.VITE_ANNICT_CLIENT_ID
    const deployUrl = isProduction
      ? import.meta.env.URL
      : import.meta.env.DEPLOY_PRIME_URL
    if (typeof ANNICT_CLIENT_ID !== "string" || typeof deployUrl !== "string") {
      return
    }
    const url = new URL(
      "https://api.annict.com/oauth/authorize?response_type=code"
    )
    url.searchParams.set("client_id", ANNICT_CLIENT_ID)
    url.searchParams.set(
      "redirect_uri",
      `${deployUrl}/.netlify/functions/annict-callback`
    )
    return url.href
  }, [])

  return (
    <SimpleGrid>
      <Button component="a" href={authUrl} color="pink">
        {annictToken && "(Re)"}Login with Annict
      </Button>
      {annictToken && (
        <AnnictUserInfo
          annictToken={annictToken}
          setAnnictConnected={setAnnictConnected}
        />
      )}
    </SimpleGrid>
  )
}
