import {
  ActionIcon,
  Checkbox,
  Grid,
  ScrollArea,
  Space,
  Title,
} from "@mantine/core"
import { useLocalStorage } from "@mantine/hooks"
import { useMemo, useState } from "react"
import { Eraser } from "tabler-icons-react"
import { StatusState } from "../annictGql"
import { AnimeWork, StatusDiff } from "../types"
import { DiffFetchButton } from "./DiffFetchButton"
import { DiffTable } from "./DiffTable"
import { DoSync } from "./DoSync"
import { MissingWorkTable } from "./MissingWorkTable"

export const CheckDiff = ({
  annictAccessToken,
  malAccessToken,
}: {
  annictAccessToken: string
  malAccessToken: string
}) => {
  const [checks, setChecks] = useState(new Set<number>())
  const [diffs, setDiffs] = useState<StatusDiff[]>([])
  const [missingWorks, setMissingWorks] = useState<AnimeWork[]>([])
  const idMap = useMemo(() => diffs.map((diff) => diff.work.annictId), [diffs])
  const [ignores, setIgnores] = useLocalStorage<number[]>({
    key: "ignoreList",
    serialize: (list) => JSON.stringify(list),
    deserialize: (str) => {
      try {
        return JSON.parse(str)
      } catch {
        return []
      }
    },
  })

  return (
    <>
      <Space h="md" />
      <Grid justify="center" align="center">
        <DiffFetchButton
          annictAccessToken={annictAccessToken}
          malAccessToken={malAccessToken}
          statuses={[
            StatusState.WATCHING,
            StatusState.WATCHED,
            StatusState.ON_HOLD,
            StatusState.STOP_WATCHING,
            StatusState.WANNA_WATCH,
          ]}
          setDiffs={setDiffs}
          setChecks={setChecks}
          setMissingWorks={setMissingWorks}
          ignores={ignores}
        />
      </Grid>
      <Space h="xl" />
      <Grid justify="space-between" px="md">
        <Checkbox
          label="Check all"
          checked={
            diffs.filter((diff) => !ignores.includes(diff.work.annictId))
              .length <= checks.size
          }
          onClick={() => {
            const isEveryChecked = idMap
              .filter((id) => !ignores.includes(id))
              .every((id) => checks.has(id))
            setChecks(
              isEveryChecked
                ? new Set()
                : new Set(idMap.filter((id) => !ignores.includes(id)))
            )
          }}
          readOnly={true}
        ></Checkbox>
        <ActionIcon
          title="Reset ignores"
          onClick={() => {
            setIgnores((ignores) => {
              setChecks((checks) => {
                const copiedChecks = new Set(checks)
                ignores.forEach((id) => {
                  if (!copiedChecks.has(id)) {
                    copiedChecks.add(id)
                  }
                })
                return copiedChecks
              })
              return []
            })
          }}
          size="lg"
        >
          <Eraser />
        </ActionIcon>
      </Grid>
      <Space h="sm" />
      <ScrollArea>
        <DiffTable
          diffs={diffs}
          checks={checks}
          setChecks={setChecks}
          ignores={ignores}
          setIgnores={setIgnores}
        />
      </ScrollArea>
      {malAccessToken && (
        <>
          <Space h="xl" />
          <DoSync
            checks={Array.from(checks)}
            setChecks={setChecks}
            diffs={diffs}
            malAccessToken={malAccessToken}
            disabled={0 === checks.size}
          />
        </>
      )}
      {0 < missingWorks.length && (
        <>
          <Space h="md" />
          <Title order={3}>Untethered works</Title>
          <Space h="sm" />
          <MissingWorkTable works={missingWorks} />
        </>
      )}
      <Space h="xl" />
    </>
  )
}
