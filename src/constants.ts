import { StatusState } from "./annictGql"

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
