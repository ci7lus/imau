import { Box, Center, Grid, Avatar, Text } from "@mantine/core"
import { memo } from "react"
import { useQuery } from "react-query"
import { MALAPI } from "../mal"

export const MALUserInfo = memo(
  ({ malAccessToken }: { malAccessToken: string }) => {
    const mal = new MALAPI(malAccessToken)
    const { data } = useQuery(
      ["MAL_PROFILE", malAccessToken],
      () => mal.getUsersMe(),
      {
        cacheTime: 6000,
        staleTime: 6000,
      }
    )
    return (
      <Box>
        <Center>
          <Grid justify="center" align="center" grow>
            <Avatar src={data?.data.picture || ""}></Avatar>
            <Grid.Col span={2}>
              <Text>@{data?.data.name}</Text>
            </Grid.Col>
          </Grid>
        </Center>
      </Box>
    )
  }
)
