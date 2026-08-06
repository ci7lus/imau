import { StatusState } from "./generated/annictGql"

export type MALAnimeStatus =
  | "watching"
  | "completed"
  | "on_hold"
  | "dropped"
  | "plan_to_watch"
  | "no_state" // Invalid on MAL

export const ANNICT_TO_MAL_STATUS_MAP: {
  [key in keyof typeof StatusState]: MALAnimeStatus
} = {
  NO_STATE: "no_state",
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
  no_state: StatusState.NO_STATE,
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
  constructor(public accessToken: string) {}

  private request<T>(
    path: string,
    init: RequestInit = {}
  ): Promise<{ data: T }> {
    return fetch(`/mal/${path}`, {
      ...init,
      headers: {
        Authorization: `Bearer ${this.accessToken}`,
        ...init.headers,
      },
    }).then(async (res) => {
      if (!res.ok) {
        throw new Error(`Request failed with status ${res.status}`)
      }
      return { data: (await res.json()) as T }
    })
  }

  getUsersMe() {
    return this.request<{ name: string; picture: string }>("users/@me")
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
    return this.request(`anime/${options.id}/my_list_status`, {
      method: "PATCH",
      body: payload,
    })
  }

  deleteAnimeStatus(options: { id: string }) {
    return this.request(`anime/${options.id}/my_list_status`, {
      method: "DELETE",
    })
  }

  getAnimeStatuses(params: {
    status?: MALAnimeStatus
    sort?: "anime_start_date"
    limit?: number
    offset?: number
    fields?: "list_status"
    nsfw?: "true"
  }) {
    const searchParams = new URLSearchParams(
      Object.entries(params)
        .filter((entry) => entry[1] !== undefined)
        .map(([k, v]) => [k, v.toString()])
    )
    return this.request<{
      data: MALListStatus[]
      paging: { next: string }
    }>(`users/@me/animelist?${searchParams}`)
  }
}
