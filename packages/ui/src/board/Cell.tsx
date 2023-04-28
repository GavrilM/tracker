import { Card, H2, H3, SizableText, XStack, YStack } from "tamagui";
import moment from 'moment'
import { useMemo } from 'react'
import { CellViewOptions, MetricType } from "./CellTypes";
import { Weekday } from "../form/WeekdayInput";
import { Graph } from "./Graph";
import _ from "lodash"

export type CellPoint = {
  timestamp: string,
  value: number | undefined
}

export type Limits = {
  min: number,
  max: number
}

type CellProps = {
  name: string,
  view: CellViewOptions
  limits?: Limits
  units: string
  target_value?: number
  lastPointDate?: Date
  points: Array<CellPoint>
}

const SUMMARY_HEIGHT = 80

export function Cell({ name, points, target_value, limits, units, view }: CellProps) {
  let content = <SizableText>(no data)</SizableText>

  if(points.length > 0) {
    if(view.base_unit > 0)
      points = useMemo(() => formatData(points, view), [points, view])

    if(view.type !== MetricType.graph) {
      const summary = useMemo(() => getSummary(points, view), [points, view])
      content = (
        <>
          <SizableText fontSize={SUMMARY_HEIGHT} fow='700' color='white'>
            {summary}
          </SizableText>
          <YStack height={SUMMARY_HEIGHT} jc='flex-end' pb={4}>
            <SizableText >
              {view.type === MetricType.streak ? getStreakUnits(summary, view) : units}
            </SizableText>
          </YStack>
        </>
      )
    } else {
      content = (
        <Graph target={target_value} data={points} yunits={units} limits={limits}
          bottomPadding={20} leftPadding={0}/>
      )
    }
  }
    
  return (
    <Card size="$4" bordered width={225} height={225} theme="alt1"
      mr="$4" mb="$4" ai="center" jc='space-between' py={16}>
      <SizableText fow='700' color='rgba(255,255,255, .9)'>{name}</SizableText>

      <XStack f={1} ai='center'>
        {content}
      </XStack>

      <SizableText>{getLabel(view, points.at(-1)?.timestamp)}</SizableText>
    </Card>
  )
}

function getSummary(data: Array<CellPoint>, view: CellViewOptions) {
  if(view.type === MetricType.lastvalue)
    return data.at(-1)?.value
  if(view.type === MetricType.streak) {
    if(view.base_unit === 7)
      return moment().diff(data[0].timestamp, 'week')
    else if(view.base_unit === 30)
      return moment().diff(data[0].timestamp, 'month')
    else
      return data.length
  }
  
  let sum = 0
  data.forEach(p => {sum += (p.value || 0)})
  if(view.type === MetricType.total)
    return sum
  else if(view.type === MetricType.average)
    return sum/data.length

  return 0
}

function formatData(data: Array<CellPoint>, view: CellViewOptions) {
  if(view.type === MetricType.lastvalue)
    return data
  
  // average or total: bound
  let xmin = formatDate(data[0].timestamp).toISOString()
  if(view.base_unit && view.type !== MetricType.streak) { 
    const now = moment()
    let diff = view.base_unit
    if(view.weekday) {
      diff = (((now.day() - view.weekday) % 7) + 7) % 7
    } else if(view.month_date) {
      const date = view.month_date === 'last day'
        ? 1
        : parseInt(view.month_date.slice(0,-2))
      if(now.date() <= date)
        now.subtract(1, 'month')
      now.date(date)
      diff = moment().diff(now, 'day')
    }
    xmin = moment().subtract(diff, 'day').toISOString()
    data = data.filter(d => d.timestamp >= xmin)
  }
  
  // streak: find first break
  // graph: bound + fill 0s
  if(view.type === MetricType.graph || view.type === MetricType.streak) {
    const now = formatDate(Date.now())
    const dataPadded: Array<CellPoint> = []
    let i = 0
    while(now.toISOString() >= xmin){
      if(i < data.length &&
        now.diff(moment(data[i].timestamp), 'day') < 1) {
        dataPadded.push(data[i])
        i++
      } else {
        if(view.type === MetricType.streak){
          if(now.diff(moment(), 'day') <= -1)
            return dataPadded
        } else {
          dataPadded.unshift({timestamp: now.toISOString(), value: undefined})
        }
      }
      now.subtract(1, 'day')
    }
    data = dataPadded
  }
  return data
}

function getLabel(view, lastPointDate) {
  const today = moment()
  switch(view.type) {
    case MetricType.lastvalue:
      return moment(lastPointDate).fromNow()
    case MetricType.streak:
      return "in a row"
    case MetricType.graph:
      return view.base_unit === 0 
        ? "all time"
        : `last ${view.base_unit} days`
    case MetricType.average:
    case MetricType.total:
      const daysSince = (((today.day() - view.weekday) % 7) + 7) % 7
      if(view.weekday) {
        if(daysSince === 0)
          return "since today"
        else if (daysSince === 1)
          return "since yesterday"
        else
          return `since ${Weekday[view.weekday]}`
      } else if (view.month_date) {
        if(daysSince === 1)
          return "since yesterday"
        if(view.month_date === 'last day') {
          return "this month"
        } else {
          if(today.date() <= parseInt(view.month_date.slice(0,-2)))
            today.subtract(1, 'month')
          return `since ${today.format('MMM')} ${view.month_date}`
        }
      } else {
        return view.base_unit === 0 
          ? `all time ${view.type}`
          : `${view.base_unit} day ${view.type}`
      }
  }
}

function getStreakUnits(value, view) {
  let str = 'day'
  if(view.base_unit === 7)
    str = 'week'
  else if(view.base_unit === 30)
    str = 'month'
  
  if(value === 1)
    return str
  return str + 's'
}

function formatDate(date) {
  return moment(moment(date).format('YYYYMMDD'))
}
