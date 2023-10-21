import { Avatar, Box, Center, Flex, Text } from "@mantine/core"
import { memo, useEffect } from "react"
import React from "react"
import { useQuery } from "react-query"
import { generateGqlClient } from "../annictApiEntry"

export const AnnictUserInfo = memo(function AnnictUserInfo({
  annictToken,
  setAnnictConnected,
}: {
  annictToken: string
  setAnnictConnected: (s: boolean) => void
}) {
  const sdk = generateGqlClient(annictToken)
  const { isLoading, data } = useQuery(
    ["ANNICT_PROFILE", annictToken],
    () => sdk.getMe(),
    { cacheTime: 6000, staleTime: 6000 }
  )
  useEffect(() => {
    setAnnictConnected(!!data)
  }, [data, setAnnictConnected])
  if (isLoading) {
    return <Center>Loading...</Center>
  }
  return (
    <Box>
      <Center>
        <Flex justify="center" align="center" gap="md">
          <Avatar src={data?.viewer?.avatarUrl || ""}></Avatar>
          <Text>
            {data?.viewer?.name} @{data?.viewer?.username}
          </Text>
        </Flex>
      </Center>
    </Box>
  )
})
