import { Button, Card, SizableText, XStack, YStack } from "tamagui";
import moment from 'moment'
import { useMemo } from 'react'
import { CELL_SIZE, CellCategories, MetricType, getCategoryColor } from "./CellTypes";
import type { CellViewOptions } from "./CellTypes"
import { Weekday } from "../form/WeekdayInput";
import { Graph } from "./Graph";
import _ from "lodash"
import { CheckCircle } from "@tamagui/lucide-icons";

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
  question_freq: {days: number}
  units: string
  category: CellCategories
  target: {
    value: number,
    direction: string,
  },
  collectable?: boolean
  onCollect: () => void
  lastPointDate?: Date
  points: Array<CellPoint>
}

const SUMMARY_HEIGHT = 80

export function Cell({ name, points, target, limits, question_freq, category, units, view, collectable, onCollect }: CellProps) {
  let content = <SizableText selectable={false}>(no data)</SizableText>

  if(points.length > 0) {
    if(view.base_unit > 0)
      points = formatData(points, view, question_freq, target?.value)

    if(points.length === 0 && view.type !== MetricType.streak){}
    else if(view.type !== MetricType.graph) {
      const summary = useMemo(() => getSummary(points, view), [points, view])
      const summaryStr = summary?.toString()
      const fos = summaryStr ? summaryStr.length > 3 ? SUMMARY_HEIGHT*(1 - summaryStr.length*.08) : SUMMARY_HEIGHT : 0
      const dir = target?.direction === "at least" ? 1 : -1
      const color = target && view.type !== MetricType.streak ? dir*summary >= dir*target?.value ? '#53C041' : '#E43F3F' : 'white'
      content = (
        <>
          <SizableText fontSize={fos} fow='700' color={color} ff='$number'>
            {summary}
          </SizableText>
          <YStack height={SUMMARY_HEIGHT} jc='flex-end' pb={4}>
            <SizableText>
              {view.type === MetricType.streak ? getStreakUnits(summary, view) : units}
            </SizableText>
          </YStack>
        </>
      )
    } else {
      content = (
        <Graph target={target} data={points} yunits={units} limits={limits}
          bottomPadding={20} leftPadding={0}/>
      )
    }
  }
    
  return (
    <Card size="$4" bordered width={CELL_SIZE} height={CELL_SIZE} theme="alt1" bc={getCategoryColor(category)}
      mr="$4" mb="$4" py={16} pb={0}>
      <YStack f={1} ai="center" jc='space-between' pointerEvents="none" >
        <SizableText fow='700' color='rgba(255,255,255, .9)' selectable={false}>{name}</SizableText>

        <XStack f={1} ai='center'>
          {content}
        </XStack>

        <SizableText fow='300' fos='$5' selectable={false} mb={5}>{getLabel(view, points.at(-1)?.timestamp)}</SizableText>
      </YStack>
      {collectable 
        ? <Button height={40} bc="rgba(224,224,224,.1)" hoverStyle={{bc: '$green10'}}
            onPress={onCollect}>
            <CheckCircle color="rgba(225,225,225,.7)"/>
          </Button>
        : <XStack height={20}/>}
    </Card>
  )
}

function getSummary(data: Array<CellPoint>, view: CellViewOptions) {
  if(view.type === MetricType.lastvalue)
    return data.at(-1)?.value || 0
  if(view.type === MetricType.streak) {
    if(view.base_unit === 7)
      return moment().diff(data[data.length - 1].timestamp, 'week')
    else if(view.base_unit === 30)
      return moment().diff(data[data.length - 1].timestamp, 'month')
    else
      return data.length
  }

  let sum = 0
  data.forEach(p => {sum += (p.value || 0)})
  if(view.type === MetricType.total)
    return sum
  else if(view.type === MetricType.average)
    return Math.round((sum/data.length) * 10) / 10

  return 0
}

function formatData(data: Array<CellPoint>, view: CellViewOptions, question_freq, target) {
  if(view.type === MetricType.lastvalue)
    return data
  
  // average or total: bound
  let xmin = formatDate(data[data.length - 1].timestamp).toISOString()
  if(view.base_unit && view.type !== MetricType.streak) { 
    const now = getCurrentDate()
    let diff = view.base_unit
    if(view.weekday != undefined) {
      diff = (((now.isoWeekday() - 1 - view.weekday) % 7) + 7) % 7
    } else if(view.month_date) {
      const date = view.month_date === 'last day'
        ? 1
        : parseInt(view.month_date.slice(0,-2))
      if(now.date() <= date)
        now.subtract(1, 'month')
      now.date(date)
      diff = getCurrentDate().diff(now, 'day')
    }
    xmin = getCurrentDate().subtract(diff, 'day').toISOString()
    data = data.filter(d => d.timestamp >= xmin)
  }
  
  const now = getCurrentDate()
  const dataPadded: Array<CellPoint> = []
  if(view.type === MetricType.graph) {
    if(question_freq.days === 1) {
      let i = 0
      while(now.toISOString() >= xmin){
        if(i < data.length && now.diff(formatDate(data[i].timestamp), 'day') < 1) {
          dataPadded.push(data[i])
          i++
        } else {
          dataPadded.unshift({timestamp: now.toISOString(), value: undefined})
        }
        now.subtract(1, 'day')
      }
      data = dataPadded
      if(data.length) {
        data.push({timestamp: xmin, value: undefined})
        data.unshift({timestamp: (new Date()).toISOString(), value: undefined})
      }
    }
  }
  else if (view.type === MetricType.streak) {
    data = processStreak(data, view, xmin, target)
  }
    
  return data
}

function processStreak(data, view, xmin, target) {
  let now = getCurrentDate()
  const dataPadded: Array<CellPoint> = []
  let i = 0
  if(now.toISOString() === formatDate(data[i].timestamp).toISOString() 
    && data[i].value === target) {
    dataPadded.push(data[i])
    i++
  }
  now.subtract(1, 'day')
  if(view.weekdays) {
    const weekdays = new Set(view.weekdays)
    while(now.toISOString() >= xmin){
      if(!weekdays.has(now.day())) {} 
      else if (now.diff(formatDate(data[i].timestamp), 'day') < 1
        && data[i].value === target){
        dataPadded.push(data[i])
        i++
      } else {
        return dataPadded
      }
      now.subtract(1, 'day')      
    }
    return dataPadded
  } else if (view.base_unit > 1) {
    const inc = view.base_unit === 7 ? 'week' : 'month'
    while(now.toISOString() >= xmin){
      if(i < data.length && now.diff(formatDate(data[i].timestamp), inc) < 1 
        && data[i].value === target) {
        dataPadded.push(data[i])
        i++
        now = formatDate(data[i].timestamp)
      } else {
        return dataPadded
      }
    }
    return dataPadded
  } else {
    while(now.toISOString() >= xmin){
      if(i < data.length && now.diff(formatDate(data[i].timestamp), 'day') < 1) {
        if(data[i].value !== target) {
          return dataPadded
        } else {
          dataPadded.push(data[i])
          i++
        }
      } else {
        return dataPadded
      }
      now.subtract(1, 'day')
    }
    return dataPadded
  }
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
      const daysSince = (((today.isoWeekday() - 1 - view.weekday) % 7) + 7) % 7
      if(view.weekday != undefined) {
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

const getCurrentDate = () => formatDate(Date.now())