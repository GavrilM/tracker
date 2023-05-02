export enum MetricType {
  graph = "graph", 
  total = "total",
  average = "average",
  streak = "streak",
  lastvalue = "last value",
}

export type CellViewOptions = {
  base_unit: number,
  type: MetricType,
  weekday: number,
  weekdays: Array<number>,
  month_date: string,
}
