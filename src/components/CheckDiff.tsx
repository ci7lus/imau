import {
  ActionIcon,
  Checkbox,
  Flex,
  ScrollArea,
  Space,
  Title,
} from "@mantine/core"
import { useLocalStorage } from "@mantine/hooks"
import React, { useCallback } from "react"
import { useMemo, useState } from "react"
import { Eraser } from "tabler-icons-react"
import { DiffFetchButton } from "./DiffFetchButton"
import { DiffTable } from "./DiffTable"
import { DoSync } from "./DoSync"
import { MissingWorkTable } from "./MissingWorkTable"
import { StatusState } from "../annictGql"
import { TargetService, TARGET_SERVICE_MAL } from "../constants"
import { AnimeWork, StatusDiff } from "../types"

export const CheckDiff = ({
  annictAccessToken,
  targetService,
  targetAccessToken,
}: {
  annictAccessToken: string
  targetService: TargetService
  targetAccessToken: string
}) => {
  const [checks, setChecks] = useState(new Set<number>())
  const [diffs, setDiffs] = useState<StatusDiff[]>([])
  const [missingWorks, setMissingWorks] = useState<AnimeWork[]>([])
  const idMap = useMemo(() => diffs.map((diff) => diff.work.annictId), [diffs])
  const [ignores, setIgnores] = useLocalStorage<number[]>({
    key: `ignoreList${
      targetService !== TARGET_SERVICE_MAL ? targetService : ""
    }`,
    defaultValue: [],
    serialize: (list) => JSON.stringify(list),
    deserialize: (str) => {
      if (!str) {
        return []
      }
      try {
        return JSON.parse(str)
      } catch {
        return []
      }
    },
  })

  const isAllChecked = useMemo(
    () =>
      diffs.filter((diff) => !ignores?.includes(diff.work.annictId)).length <=
      checks.size,
    [checks.size, diffs, ignores]
  )
  const handleCheckAll = useCallback(() => {
    const isEveryChecked = idMap
      .filter((id) => !ignores?.includes(id))
      .every((id) => checks.has(id))
    setChecks(
      isEveryChecked
        ? new Set()
        : new Set(idMap.filter((id) => !ignores?.includes(id)))
    )
  }, [checks, idMap, ignores])
  const handleReset = useCallback(() => {
    const confirmed = confirm("Are you sure you want to reset?")
    if (!confirmed) {
      return
    }
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
  }, [setIgnores])

  return (
    <>
      <Space h="md" />
      <Flex justify="center" align="center">
        <DiffFetchButton
          annictAccessToken={annictAccessToken}
          targetService={targetService}
          targetAccessToken={targetAccessToken}
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
          ignores={ignores as number[]}
        />
      </Flex>
      <Space h="xl" />
      <Flex justify="space-between" align="center" px="md">
        <Checkbox
          label="Check all"
          checked={isAllChecked}
          onClick={handleCheckAll}
          readOnly={true}
        ></Checkbox>
        <ActionIcon title="Reset ignores" onClick={handleReset} size="lg">
          <Eraser />
        </ActionIcon>
      </Flex>
      <Space h="sm" />
      <ScrollArea>
        <DiffTable
          diffs={diffs}
          checks={checks}
          setChecks={setChecks}
          ignores={ignores as number[]}
          setIgnores={setIgnores}
          targetService={targetService}
        />
      </ScrollArea>
      {targetAccessToken && (
        <>
          <Space h="xl" />
          <DoSync
            checks={Array.from(checks)}
            setChecks={setChecks}
            diffs={diffs}
            targetService={targetService}
            targetAccessToken={targetAccessToken}
          />
        </>
      )}
      {0 < missingWorks.length && (
        <>
          <Space h="md" />
          <Title order={3}>Untethered works</Title>
          <Space h="sm" />
          <MissingWorkTable
            works={missingWorks}
            targetService={targetService}
          />
        </>
      )}
      <Space h="xl" />
    </>
  )
}
