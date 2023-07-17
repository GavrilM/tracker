import moment from 'moment'
import { Metric, TargetDirection } from "./types/Metric";
import { CollectReview } from './types/QueryResult';
import { MetricType } from '@my/ui';

export function genQuestions(metrics: Array<Metric>, targetDate: string): Array<Metric> {
  const date = formatDate(targetDate)
  return metrics.filter(({ question_freq, last_point }) => {    
    const lastPointDate = formatDate(last_point?.timestamp)
    if(date.toISOString() === lastPointDate.toISOString())
      return false
    
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
      if(!last_point?.timestamp)
        return true
      return date.diff(lastPointDate, 'day') >= question_freq.days
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
  metrics.forEach(({ _id, name, target, units, view }) => {
    const unitStr = units ? units : ''
    if(target) {
      const dir = target?.direction === TargetDirection.AtLeast ? 1 : -1
      const diff = dir*(pointLookup[_id].value - target.value)
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

export const withOwnerId = (o, userId): any => Object.assign({owner_id: {link: userId}}, o)

export const getCurrentDate = () => moment(moment().format('YYYYMMDD')).toISOString()

export function formatDate(date) {
  return moment(moment(date).format('YYYYMMDD'))
}