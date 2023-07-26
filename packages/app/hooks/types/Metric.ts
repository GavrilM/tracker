import { CellCategories, MetricType } from "@my/ui"
import { Point } from "./Point"
import type { CellViewOptions } from "@my/ui"

export enum TargetDirection {
  AtLeast = 'at least',
  AtMost = 'at most'
}

type QuestionFreq = {
  days: number,
  weekdays: Array<number>,
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
  target: {
    value: number
    direction: TargetDirection
  }
  category: CellCategories
  units: string
  view: CellViewOptions

  last_point: Point
  points_default: Array<Point>
}

const dummmyPoint = {
  owner_id: '',
  metric_id: '',
  timestamp: '',
  value: 0
}

export const DummyMetric = {
  _id: '',
  name: '',
  question: '',
  question_freq: {
    days: 0,
    weekdays: [],
    month_date: ''
  },
  limits: {
    min: 0,
    min_label: '',
    max: 0,
    max_label: '',
  },
  target: {
    value: 0,
    direction: TargetDirection.AtLeast
  },
  category: CellCategories.default,
  units: '',
  view: {
    base_unit: 0,
    type: MetricType.average,
    weekday: 0,
    weekdays: [],
    month_date: '',
  },
  last_point: dummmyPoint,
  points_default: []
}