import axios, { AxiosInstance } from "axios"
import { StatusState } from "./annictGql"

export type MALAnimeStatus =
  | "watching"
  | "completed"
  | "on_hold"
  | "dropped"
  | "plan_to_watch"

export const ANNICT_TO_MAL_STATUS_MAP: {
  [key in keyof typeof StatusState]: MALAnimeStatus
} = {
  NO_STATE: "on_hold", // Invalid
  ON_HOLD: "on_hold",
  WATCHING: "watching",
  STOP_WATCHING: "dropped",
  WANNA_WATCH: "plan_to_watch",
  WATCHED: "completed",
}

export const MAL_TO_ANNICT_STATUS_MAP: {
  [key in MALAnimeStatus]: keyof typeof StatusState
} = {
  watching: StatusState.WATCHING,
  completed: StatusState.WATCHED,
  on_hold: StatusState.ON_HOLD,
  dropped: StatusState.STOP_WATCHING,
  plan_to_watch: StatusState.WANNA_WATCH,
}

export type MALAnimeNode = {
  id: number
  title: string
}

export type MALListStatus = {
  node: MALAnimeNode
  list_status: {
    status: MALAnimeStatus
    num_episodes_watched: number
  }
}

export class MALAPI {
  public client: AxiosInstance
  constructor(public accessToken: string) {
    this.client = axios.create({
      headers: { Authorization: `Bearer ${accessToken}` },
      baseURL: "/mal/",
    })
  }

  getUsersMe() {
    return this.client.get<{ name: string; picture: string }>("/users/@me")
  }

  updateAnimeStatus(options: {
    id: string
    status: MALAnimeStatus
    is_rewatching?: boolean
    score?: number
    num_watched_episodes?: number
    priority?: number
  }) {
    const payload = new URLSearchParams(
      Object.entries(options)
        .filter(([k, v]) => v && k !== "id")
        .map(([k, v]) => [k, v.toString()])
    )
    return this.client.patch(`/anime/${options.id}/my_list_status`, payload)
  }

  getAnimeStatuses(params: {
    status?: MALAnimeStatus
    sort?: "anime_start_date"
    limit?: number
    offset?: number
    fields?: "list_status"
  }) {
    return this.client.get<{
      data: MALListStatus[]
      paging: { next: string }
    }>("/users/@me/animelist", {
      params,
    })
  }
}
