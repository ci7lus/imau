import { GraphQLClient } from "graphql-request"
import { aniListFetch } from "./aniListRateLimit"
import { getSdk } from "./generated/aniListGql"

const ANILIST_GRAPHQL_ENDPOINT = "https://graphql.anilist.co"

export const generateGqlClient = (
  accessToken: string,
  signal?: AbortSignal
) => {
  const client = new GraphQLClient(ANILIST_GRAPHQL_ENDPOINT, {
    fetch: aniListFetch,
    signal,
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  })
  return getSdk(client)
}
