import { Button, SimpleGrid } from "@mantine/core"
import { useMemo } from "react"
import React from "react"
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
    const ANNICT_REDIRECT_URL = import.meta.env.VITE_ANNICT_REDIRECT_URL
    if (
      typeof ANNICT_CLIENT_ID !== "string" ||
      typeof ANNICT_REDIRECT_URL !== "string"
    ) {
      return
    }
    const url = new URL(
      "https://api.annict.com/oauth/authorize?response_type=code"
    )
    url.searchParams.set("client_id", ANNICT_CLIENT_ID)
    url.searchParams.set("redirect_uri", ANNICT_REDIRECT_URL)
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
