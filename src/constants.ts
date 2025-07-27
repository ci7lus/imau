import type { StatusState } from "./generated/annictGql"

type StatusStateKey = keyof typeof StatusState

export const WATCH_STATUS_MAP: { [key in StatusStateKey]: string } = {
  NO_STATE: "No State",
  ON_HOLD: "On Hold",
  WATCHING: "Watching",
  STOP_WATCHING: "Stop Watching",
  WANNA_WATCH: "Wanna Watch",
  WATCHED: "Watched",
}

export const TARGET_SERVICE_MAL = "mal"
export const TARGET_SERVICE_ANILIST = "anilist"
export type TargetService =
  | typeof TARGET_SERVICE_MAL
  | typeof TARGET_SERVICE_ANILIST
export const TARGET_SERVICE_NAMES: Record<TargetService, string> = {
  mal: "MyAnimeList",
  anilist: "AniList",
}
export const TARGET_SERVICE_URLS: Record<TargetService, string> = {
  mal: "https://myanimelist.net/anime/",
  anilist: "https://anilist.co/anime/",
}
