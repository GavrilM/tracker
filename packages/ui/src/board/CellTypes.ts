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
  physical = "_Physical Health",
  emotional = "_Emotional Wellness",
  relationships = "_Relationships",
  work = "_Work",
  finances = "_Finances",
  community = "_Community",
  responsibility = "_Responsibility",
  learning = "_Learning",
  creativity = "_Creativity",
  spirituality = "_Spirituality",
}