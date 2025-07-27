import { Avatar, Box, Center, Flex, Text } from "@mantine/core"
import { memo, useEffect } from "react"
import { useQuery } from "react-query"
import { generateGqlClient } from "../aniListApiEntry"

export const AniListUserInfo = memo(function AniListUserInfo({
  aniListAccessToken,
  setAniListConnected,
}: {
  aniListAccessToken: string
  setAniListConnected: (s: boolean) => void
}) {
  const aniList = generateGqlClient(aniListAccessToken)
  const { data, isLoading } = useQuery(
    ["ANILIST_PROFILE", aniListAccessToken],
    () => aniList.getMe(),
    {
      cacheTime: 6000,
      staleTime: 6000,
    }
  )
  useEffect(() => {
    setAniListConnected(!!data)
  }, [data, setAniListConnected])
  if (isLoading) {
    return <Center>Loading...</Center>
  }
  return (
    <Box>
      <Center>
        <Flex justify="center" align="center" gap="md">
          <Avatar src={data?.Viewer?.avatar?.large || ""}></Avatar>
          <Text>@{data?.Viewer?.name}</Text>
        </Flex>
      </Center>
    </Box>
  )
})
