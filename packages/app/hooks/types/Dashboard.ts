import { CellCategories } from "@my/ui"

export type BoardLayouts = {[index: number]: Array<Array<string>>}
export type BoardColors = {[id: string]: CellCategories}

export type Dashboard = {
  _id: string
  name: string
  metricIds: Array<string>,
  layouts: BoardLayouts | null,
  colors: BoardColors | null
}

export const DummyDashboard: Dashboard = {
  _id: '',
  name: '',
  metricIds: [''],
  layouts: null,
  colors: null
}