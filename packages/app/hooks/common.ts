import moment from 'moment'
import { Metric } from "./types/Metric";

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
      const daysSinceLastPoint = last_point 
        ? date.diff(moment(last_point.timestamp), 'day')
        : Infinity 
      return daysSinceLastPoint > question_freq.days
    }
  })
}