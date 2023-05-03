import { MetricType } from "@my/ui"

const nPeriods = {
  'Overall': 0,
  '1 day': 1,
  '7 day': 7,
  '30 day': 30,
}
const lyPeriods = {
  'Overall': 0,
  'Daily': 1,
  'Weekly': 7,
  'Monthly': 30
}
const nPeriodStrings = {
  0: 'Overall',
  1: '1 day',
  7: '7 day',
  30: '30 day'
}
const lyPeriodStrings = {
  0: 'Overall',
  1: 'Daily',
  7: 'Weekly',
  30: 'Monthly'
}

export const isAggregate = t => t === MetricType.total || t === MetricType.average || t === MetricType.graph

export const isTimeBounded = t => t === MetricType.streak

export const doesReset = v => v?.weekday != undefined || v?.month_date != undefined || v?.weekdays != undefined

export function getPeriod(view) {
  const uselyPeriods = view?.type === MetricType.streak || (isAggregate(view?.type) && doesReset(view))
  const periods = uselyPeriods ? lyPeriods : nPeriods 
  const periodStrings = uselyPeriods ? lyPeriodStrings : nPeriodStrings
  return [periods, periodStrings]
}
