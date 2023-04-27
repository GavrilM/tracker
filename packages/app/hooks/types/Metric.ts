import { MetricType } from "@my/ui"
import { Point } from "./Point"
import { CellViewOptions } from "@my/ui"

type QuestionFreq = {
  days: number,
  weekdays: [number],
  month_date: string
}

type Limits = {
  min: number
  min_label: string,
  max: number
  max_label: string,
}

export type Metric = {
  _id: string,
  name: string,
  question: string,
  question_freq: QuestionFreq
  limits: Limits
  target_value: number
  units: string
  view: CellViewOptions

  last_point: Point
  points_default: Array<Point>
}