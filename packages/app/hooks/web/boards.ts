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
  const [fn] = useMutation(SAVE_LAYOUT, {
    refetchQueries: ['InitialMetrics']
  })
  return [
    (rowLen: number, layout: Array<Array<string>>, colorMap) => {
      while(layout.at(-1)?.every(i => i === ''))
        layout.pop()
      const newLayouts = layouts ? layouts : {}
      newLayouts[rowLen] = layout
      const l = Object.entries(newLayouts)
        .map(([row_len, grid]) => ({
          row_len,
          grid: JSON.stringify(grid)
        }))
      const colors = Object.entries(colorMap).map(([id, color]) => ({id, color}))
      console.log(colors)
      fn({
        variables: {
          query: { _id },
          set: { colors, layouts: l }
        }
      })
    }
  ]
}
