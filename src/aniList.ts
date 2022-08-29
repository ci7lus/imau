import { MediaListStatus } from "./aniListGql"
import { StatusState } from "./annictGql"

export const ANILIST_TO_ANNICT_STATUS_MAP: {
  [key in MediaListStatus]: keyof typeof StatusState
} = {
  CURRENT: StatusState.WATCHING,
  COMPLETED: StatusState.WATCHED,
  PAUSED: StatusState.ON_HOLD,
  DROPPED: StatusState.STOP_WATCHING,
  PLANNING: StatusState.WANNA_WATCH,
  REPEATING: StatusState.WATCHING,
}

export const ANNICT_TO_ANILIST_STATUS_MAP: {
  [key in keyof typeof StatusState]?: keyof typeof MediaListStatus
} = {
  WATCHING: "Current",
  WATCHED: "Completed",
  ON_HOLD: "Paused",
  STOP_WATCHING: "Dropped",
  WANNA_WATCH: "Planning",
}
