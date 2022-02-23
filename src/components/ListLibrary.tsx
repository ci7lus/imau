import { Checkbox, Grid, Space } from "@mantine/core"
import { useMemo, useState } from "react"
import { StatusState } from "../annictGql"
import { AnimeWork } from "../types"
import { DoSync } from "./DoSync"
import { LibraryFetchButton } from "./LibraryFetchButton"
import { WorkTable } from "./WorkTable"

export const ListLibrary = ({
  annictAccessToken,
  malAccessToken,
}: {
  annictAccessToken: string
  malAccessToken: string
}) => {
  const [works, setWorks] = useState(new Map<number, AnimeWork>())
  const [checks, setChecks] = useState(new Set<number>())

  const isEveryChecked = useMemo(
    () => Array.from(works.values()).every((work) => checks.has(work.annictId)),
    [works]
  )
  return (
    <>
      <Space h="md" />
      <Grid justify="center" align="center">
        <Grid.Col span={2}>
          <LibraryFetchButton
            annictAccessToken={annictAccessToken}
            targetStatus={StatusState.WATCHING}
            setChecks={setChecks}
            setWorks={setWorks}
            isEveryChecked={isEveryChecked}
          />
        </Grid.Col>
        <Grid.Col span={2}>
          <LibraryFetchButton
            annictAccessToken={annictAccessToken}
            targetStatus={StatusState.WATCHED}
            setChecks={setChecks}
            setWorks={setWorks}
            isEveryChecked={isEveryChecked}
          />
        </Grid.Col>
      </Grid>
      <Space h="xl" />
      <Checkbox
        label="Check all"
        checked={checks.size === works.size}
        onClick={() => {
          const isEveryChecked = Array.from(works.values()).every((work) =>
            checks.has(work.annictId)
          )
          setChecks(isEveryChecked ? new Set() : new Set(works.keys()))
        }}
        readOnly={true}
      ></Checkbox>
      <Space h="sm" />
      <WorkTable works={works} checks={checks} setChecks={setChecks} />
      {malAccessToken && 0 < checks.size && (
        <>
          <Space h="xl" />
          <DoSync
            checks={Array.from(checks)}
            works={works}
            malAccessToken={malAccessToken}
          />
        </>
      )}
      <Space h="xl" />
    </>
  )
}
