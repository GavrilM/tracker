import { Point } from "./Point"

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
  last_point: Point
  units: string
}