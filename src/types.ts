import { MediaListStatus } from "./aniListGql"
import { StatusState } from "./annictGql"
import { MALAnimeStatus } from "./mal"

export type AnimeWork = {
  annictId: number
  malId: string | null
  title: string
  titleEn: string | null
  titleRo: string | null
  noEpisodes: boolean
  watchedEpisodeCount: number
  status: StatusState
}

export type StatusDiff = {
  work: AnimeWork
  target?: {
    watchedEpisodeCount: number
    status: MALAnimeStatus | keyof typeof MediaListStatus | null
    title: string
  }
}
