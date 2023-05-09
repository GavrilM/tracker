import { gql, useMutation } from "@apollo/client"
import { useDashboard } from "app/provider/context/DashboardContext"

const SAVE_LAYOUT = gql`
  mutation SaveLayout($query: BoardQueryInput!, $set: BoardUpdateInput!) {
    updateOneBoard(query: $query, set: $set) {
      _id
    }
  }
`

export const useSaveLayout = () => {
  const { _id, layouts } = useDashboard()
  const [fn] = useMutation(SAVE_LAYOUT)
  return [
    (rowLen: number, layout: Array<Array<string>>) => {
      const newLayouts = layouts ? layouts : {}
      newLayouts[rowLen] = layout
      fn({
        variables: {
          query: {_id},
          set: { layouts: Object.entries(newLayouts)
            .map(([row_len, grid]) => ({
              row_len,
              grid: JSON.stringify(grid)
            }))
          }
        }
      })
    }
  ]
}