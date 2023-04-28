import moment from 'moment'
import { Metric } from "./types/Metric";
import { CollectReview } from './types/QueryResult';

export function genQuestions(metrics: Array<Metric>, targetDate: Date): Array<Metric> {
  const date = moment(targetDate)
  return metrics.filter(({ _id, question_freq, last_point }) => {
    if(question_freq.month_date != undefined) {
      if(question_freq.month_date === 'last day'){
        const month = date.month()
        date.add(1, 'day')
        return date.month() != month
      }
      const monthDate = parseInt(question_freq.month_date.slice(0,-2))
      return monthDate === date.date()
    } else if(question_freq.weekdays != undefined) {
      return question_freq.weekdays.includes(date.day())
    } else {
      const daysSinceLastPoint = last_point?.timestamp 
        ? date.diff(moment(last_point.timestamp), 'day')
        : Infinity 
      return daysSinceLastPoint > question_freq.days
    }
  })
}

export function genQuestionReview(metrics: Array<Metric>, targetDate: Date): CollectReview {
  const date = moment(targetDate)
  const result: CollectReview = {targetsMet: [], targetsMissed: []}
  metrics.forEach(({ name, last_point, target_value, units }) => {
    if(last_point && target_value
      && date.diff(moment(last_point.timestamp), 'day')  === 0) {
      const diff = last_point.value - target_value
      if(diff >= 0)
        result.targetsMet.push(`${name} by ${diff} ${units}`)
      else
        result.targetsMissed.push(`${name} by ${-diff} ${units}`)
    }
  })
  return result
}