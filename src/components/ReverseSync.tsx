import { Button, Center, SimpleGrid, Text } from "@mantine/core"
import { useMemo, useState } from "react"
import { MALAPI } from "../mal"
import { AnimeWork } from "../types"
import { MissingWorkTable } from "./MissingWorkTable"

export const ReverseSync = ({
  malAccessToken,
  works,
}: {
  malAccessToken: string
  works: AnimeWork[]
}) => {
  const mal = new MALAPI(malAccessToken)
  const [isFetching, setIsFetching] = useState(false)
  const [malWatchingWorks, setMalWatchingWorks] = useState<
    { id: number; title: string }[]
  >([])
  const [checks, setChecks] = useState(new Set<number>())
  const deletedWorks = useMemo(() => {
    return malWatchingWorks.filter(
      (work) => !works.find((w) => w.malId === work.id.toString())
    )
  }, [malWatchingWorks, works])
  return (
    <SimpleGrid>
      <Text size="lg">Apply unwatched</Text>
      <Center>
        <Button
          onClick={() => {
            setIsFetching(true)
            mal
              .getAnimeStatuses({
                status: "watching",
                sort: "anime_start_date",
                limit: 1000,
                offset: 0,
              })
              .then((data) => [
                setMalWatchingWorks(
                  data.data.data.map((datum) => ({ ...datum.node }))
                ),
              ])
              .catch(console.error)
              .finally(() => setIsFetching(false))
          }}
          disabled={isFetching}
        >
          Fetch Watching in MyAnimeList
        </Button>
      </Center>
      <MissingWorkTable
        works={deletedWorks}
        checks={checks}
        setChecks={setChecks}
        setWorks=
      />
    </SimpleGrid>
  )
}
