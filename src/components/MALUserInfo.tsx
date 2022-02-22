import { Box, Center, Grid, Avatar, Text } from "@mantine/core"
import axios from "axios"
import { useQuery } from "react-query"

export const MALUserInfo = ({ malAccessToken }: { malAccessToken: string }) => {
  const mal = axios.create({
    headers: { Authorization: `Bearer ${malAccessToken}` },
    baseURL: "/mal/",
  })
  const { data } = useQuery(["MAL_PROFILE", malAccessToken], () =>
    mal.get<{ name: string; picture: string }>("/users/@me")
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
