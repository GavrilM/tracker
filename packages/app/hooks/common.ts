import moment from 'moment'
import { Metric } from "./types/Metric";
import { CollectReview } from './types/QueryResult';
import { MetricType } from '@my/ui';

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

export function genQuestionReview(metrics: Array<Metric>, pointLookup): CollectReview {
  const result: CollectReview = {
    targetsMet: [],
    targetsMissed: [],
    streaksKept: [],
    streaksMissed: [],
    total: metrics.length
  }
  metrics.forEach(({ _id, name, target_value, units, view }) => {
    const unitStr = units ? units : ''
    if(target_value) {
      const diff = pointLookup[_id].value - target_value
      if(view.type === MetricType.streak) {
        if(diff === 0)
          result.streaksKept.push(name)
        else
          result.streaksMissed.push(name)
      } else {
        if(diff >= 0)
          result.targetsMet.push(`${name} by ${diff} ${unitStr}`)
        else
          result.targetsMissed.push(`${name} by ${-diff} ${unitStr}`)
      }
    }
  })
  return result
}