import { GraphQLClient } from "graphql-request"
import { getSdk } from "./aniListGql"

const ANILIST_GRAPHQL_ENDPOINT = "https://graphql.anilist.co"

export const generateGqlClient = (accessToken: string) => {
  const client = new GraphQLClient(ANILIST_GRAPHQL_ENDPOINT, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  })
  return getSdk(client)
}
