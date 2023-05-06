import { Metric } from "./Metric"

export type CellLayout = {
  row_len: number
  grid: Array<Array<string>>
}

export type Dashboard = {
  _id: string
  name: string
  metrics: Array<Metric>,
  layouts: Array<CellLayout>
}