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

export enum CellCategories {
  red = "red",
  orange = "orange",
  yellow = "yellow",
  green = "green",
  blue = "blue",
  indigo = "indigo",
  purple = "purple",
  pink = "pink",
}

export const CELL_SIZE = 225

export function getCategoryColor(category: CellCategories) {
  switch(category) {
    case CellCategories.red:
      return '$red3'
    case CellCategories.orange:
      return '$orange3'
    case CellCategories.yellow:
      return '$yellow4'
    case CellCategories.green:
      return '$green4'
    case CellCategories.blue:
      return '$blue3'
    case CellCategories.indigo:
      return '#1C3339'
    case CellCategories.purple:
      return '$purple3'
    case CellCategories.pink:
      return '$pink3'
  }
}
