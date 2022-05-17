import { Checkbox, Grid, Space, Title } from "@mantine/core"
import { useMemo, useState } from "react"
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
        />
      </Grid>
      <Space h="xl" />
      <Checkbox
        label="Check all"
        checked={checks.size === diffs.length}
        onClick={() => {
          const isEveryChecked = idMap.every((id) => checks.has(id))
          setChecks(isEveryChecked ? new Set() : new Set(idMap))
        }}
        readOnly={true}
      ></Checkbox>
      <Space h="sm" />
      <DiffTable diffs={diffs} checks={checks} setChecks={setChecks} />
      {malAccessToken && 0 < checks.size && (
        <>
          <Space h="xl" />
          <DoSync
            checks={Array.from(checks)}
            setChecks={setChecks}
            diffs={diffs}
            malAccessToken={malAccessToken}
          />
        </>
      )}
      <Space h="md" />
      {0 < missingWorks.length && (
        <>
          <Title order={3}>Untethered works</Title>
          <Space h="sm" />
          <MissingWorkTable works={missingWorks} />
        </>
      )}
      <Space h="xl" />
    </>
  )
}
