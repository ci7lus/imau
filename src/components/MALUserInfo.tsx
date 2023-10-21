import { Box, Center, Avatar, Text, Flex } from "@mantine/core"
import { memo, useEffect } from "react"
import React from "react"
import { useQuery } from "react-query"
import { MALAPI } from "../mal"

export const MALUserInfo = memo(function MALUserInfo({
  malAccessToken,
  setMalConnected,
}: {
  malAccessToken: string
  setMalConnected: (s: boolean) => void
}) {
  const mal = new MALAPI(malAccessToken)
  const { data, isLoading } = useQuery(
    ["MAL_PROFILE", malAccessToken],
    () => mal.getUsersMe(),
    {
      cacheTime: 6000,
      staleTime: 6000,
    }
  )
  useEffect(() => {
    setMalConnected(!!data)
  }, [data, setMalConnected])
  if (isLoading) {
    return <Center>Loading...</Center>
  }
  return (
    <Box>
      <Center>
        <Flex justify="center" align="center" gap="md">
          <Avatar src={data?.data.picture || ""}></Avatar>
          <Text>@{data?.data.name}</Text>
        </Flex>
      </Center>
    </Box>
  )
})
