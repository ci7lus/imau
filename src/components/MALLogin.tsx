import { Button } from "@mantine/core"

export const MALLogin = ({
  malAccessToken,
}: {
  malAccessToken: string
  setMalAccessToken: (s: string) => void
}) => {
  return (
    <>
      <Button>{malAccessToken && "(Re)"}Login with MAL</Button>
    </>
  )
}
