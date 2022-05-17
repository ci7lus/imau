import { StatusState } from "./annictGql"
import { MALAnimeStatus } from "./mal"

export type AnimeWork = {
  annictId: number
  malId: string | null
  title: string
  noEpisodes: boolean
  watchedEpisodeCount: number
  status: StatusState
}

export type StatusDiff = {
  work: AnimeWork
  mal?: {
    watchedEpisodeCount: number
    status: MALAnimeStatus
    title: string
  }
}
