import { Box, Center, Grid, Avatar, Text } from "@mantine/core"
import { memo, useEffect } from "react"
import { useQuery } from "react-query"
import { generateGqlClient } from "../aniListApiEntry"

export const AniListUserInfo = memo(
  ({
    aniListAccessToken,
    setAniListConnected,
  }: {
    aniListAccessToken: string
    setAniListConnected: (s: boolean) => void
  }) => {
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
    }, [data])
    if (isLoading) {
      return <Center>Loading...</Center>
    }
    return (
      <Box>
        <Center>
          <Grid justify="center" align="center" grow>
            <Avatar src={data?.Viewer?.avatar?.large || ""}></Avatar>
            <Grid.Col span={2}>
              <Text>@{data?.Viewer?.name}</Text>
            </Grid.Col>
          </Grid>
        </Center>
      </Box>
    )
  }
)
