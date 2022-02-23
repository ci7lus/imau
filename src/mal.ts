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

  updateAnimeStatus({
    id,
    status,
    is_rewatching,
    score,
    num_episodes_watched,
    priority,
  }: {
    id: string
    status: MALAnimeStatus
    is_rewatching?: boolean
    score?: number
    num_episodes_watched?: number
    priority?: number
  }) {
    return this.client.patch(`/anime/${id}/my_list_status`, {
      status,
      is_rewatching,
      score,
      num_episodes_watched,
      priority,
    })
  }
}
