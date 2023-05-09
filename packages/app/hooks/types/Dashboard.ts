export type BoardLayouts = {[index: number]: Array<Array<string>>}

export type Dashboard = {
  _id: string
  name: string
  metricIds: Array<string>,
  layouts: BoardLayouts | null
}

export const DummyDashboard: Dashboard = {
  _id: '',
  name: '',
  metricIds: [''],
  layouts: null
}