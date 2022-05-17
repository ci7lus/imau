import { Avatar, Box, Center, Grid, Text } from "@mantine/core"
import { memo, useEffect } from "react"
import { useQuery } from "react-query"
import { generateGqlClient } from "../annictApiEntry"

export const AnnictUserInfo = memo(
  ({
    annictToken,
    setAnnictConnected,
  }: {
    annictToken: string
    setAnnictConnected: (s: boolean) => void
  }) => {
    const sdk = generateGqlClient(annictToken)
    const { isLoading, data } = useQuery(
      ["ANNICT_PROFILE", annictToken],
      () => sdk.getMe(),
      { cacheTime: 6000, staleTime: 6000 }
    )
    useEffect(() => {
      setAnnictConnected(!!data)
    }, [data])
    if (isLoading) {
      return <Center>Loading...</Center>
    }
    return (
      <Box>
        <Center>
          <Grid justify="center" align="center" grow>
            <Avatar src={data?.viewer?.avatarUrl || ""}></Avatar>
            <Grid.Col span={2}>
              <Text>
                {data?.viewer?.name} @{data?.viewer?.username}
              </Text>
            </Grid.Col>
          </Grid>
        </Center>
      </Box>
    )
  }
)
