import { StatusState } from "./annictGql"

export type AnimeWork = {
  annictId: number
  malId: string | null
  title: string
  noEpisodes: boolean
  watchedEpisodeCount: number
  status: StatusState
}
