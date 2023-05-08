export type BoardLayouts = {[index: number]: Array<Array<string>>}

export type Dashboard = {
  _id: string
  name: string
  metricIds: Array<string>,
  layouts?: BoardLayouts
}

export const DummyDashboard = {
  _id: '',
  name: '',
  metricIds: ['']
}