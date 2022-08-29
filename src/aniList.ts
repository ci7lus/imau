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
  [key in keyof typeof StatusState]: MediaListStatus
} = {
  WATCHING: MediaListStatus.Current,
  WATCHED: MediaListStatus.Completed,
  ON_HOLD: MediaListStatus.Paused,
  STOP_WATCHING: MediaListStatus.Dropped,
  WANNA_WATCH: MediaListStatus.Planning,
  // 実際には来ない
  NO_STATE: MediaListStatus.Dropped,
}
