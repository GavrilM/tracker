import { Card, H2, H3, SizableText, XStack, YStack } from "tamagui";
import moment from 'moment'
import {curveBasis, line, scaleLinear, scaleTime} from 'd3';
import { CellViewOptions, MetricType } from "./CellTypes";
import { Weekday } from "../form/WeekdayInput";
import { Graph } from "./Graph";

type CellPoint = {
  timestamp: Date,
  value: number
}

type CellProps = {
  title: string,
  view: CellViewOptions,
  units: string,
  lastPointDate?: Date
  points: Array<CellPoint>
}

const SUMMARY_HEIGHT = 80
const GRAPH_HEIGHT = 120
const GRAPH_WIDTH = 180

export function Cell({ title, points, units, view }: CellProps) {
  let content = <SizableText>(no data)</SizableText>

  if(points.length > 0) {
    if(view.type !== MetricType.graph)
      content = (
        <>
          <SizableText fontSize={SUMMARY_HEIGHT} fow='700' color='white'>
            {getSummary(view, points)}
          </SizableText>
          <YStack height={SUMMARY_HEIGHT} jc='flex-end' pb={4}>
            <SizableText >{units}</SizableText>
          </YStack>
        </>
      )
    else
      content = (
        <Graph width={GRAPH_WIDTH} height={GRAPH_HEIGHT} 
          bottomPadding={20} leftPadding={0}/>
      )
  }
    
  return (
    <Card size="$4" bordered width={225} height={225} theme="alt1"
      mr="$4" mb="$4" ai="center" jc='space-between' py={16}>
      <SizableText fow='700' color='white'>{title}</SizableText>

      <XStack f={1} ai='center'>
        {content}
      </XStack>

      <SizableText>{getLabel(view, points.at(-1)?.timestamp)}</SizableText>
    </Card>
  )
}

function getSummary(view, points) {
  return 42
}

function getGraph(data: Array<CellPoint>) {
  const max = Math.max(...data.map(val => val.value));
  const min = Math.min(...data.map(val => val.value));
  const y = scaleLinear().domain([0, max]).range([GRAPH_HEIGHT, 35]);

  const x = scaleTime()
    .domain([new Date(2000, 1, 1), new Date(2000, 1, 15)])
    .range([10, GRAPH_WIDTH - 10]);

  const curvedLine = line<CellPoint>()
    .x(d => x(new Date(d.timestamp)))
    .y(d => y(d.value))
    .curve(curveBasis)(data);

  return {
    max,
    min,
    curve: curvedLine!,
  };
};

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
        }
        else {
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
