import { Avatar, Box, Center, Grid, Text } from "@mantine/core"
import { useQuery } from "react-query"
import { generateGqlClient } from "../annictApiEntry"

export const AnnictUserInfo = ({ annictToken }: { annictToken: string }) => {
  const sdk = generateGqlClient(annictToken)
  const { isLoading, data } = useQuery(["ANNICT_PROFILE", annictToken], () =>
    sdk.getMe()
  )
  if (isLoading) {
    return <>Loading...</>
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
