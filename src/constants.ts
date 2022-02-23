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
