import {
  Anchor,
  Button,
  Checkbox,
  SimpleGrid,
  Table,
  Text,
} from "@mantine/core"
import { WATCH_STATUS_MAP } from "../constants"
import { AnimeWork } from "../types"

export type MissingWork = { id: number; title: string }

export const MissingWorkTable = ({
  works,
  checks,
  setChecks,
}: {
  works: MissingWork[]
  setWorks: React.Dispatch<React.SetStateAction<Set<number>>>
  checks: Set<number>
  setChecks: React.Dispatch<React.SetStateAction<Set<number>>>
}) => {
  return (
    <Table>
      <thead>
        <tr>
          <th>Title</th>
          <th>Action</th>
        </tr>
      </thead>
      <tbody>
        {works.map((work) => (
          <tr key={work.id}>
            <td>
              <Anchor
                href={`https://myanimelist.net/anime/${work.id}`}
                target="_blank"
              >
                {work.title}
              </Anchor>
            </td>
            <td>
              <SimpleGrid spacing={2} cols={2}>
                <Button color="orange">Hold</Button>
                <Button color="red">Drop</Button>
              </SimpleGrid>
            </td>
          </tr>
        ))}
      </tbody>
    </Table>
  )
}
