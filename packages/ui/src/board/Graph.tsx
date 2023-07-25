import { useMemo } from 'react'
import { G, Line, Path, Svg, Text } from 'react-native-svg';
import {curveBumpX, line, scaleLinear, scaleTime} from 'd3';
import { CellPoint, Limits } from './Cell';
import _ from 'lodash'
import { SizableText, XStack } from 'tamagui';

type GraphProps = {
  width?: number,
  height?: number,
  bottomPadding: number,
  leftPadding: number,
  data?: any
  target?: {
    value: number,
    direction: string,
  },
  limits?: Limits
  yunits: string
}

const GRAPH_HEIGHT = 110
const GRAPH_WIDTH = 180
const FONT_SIZE = 14
const axisLineColor = '#646464'

export function Graph({ width=GRAPH_WIDTH, height=GRAPH_HEIGHT, data, target, limits, bottomPadding, leftPadding, yunits }: GraphProps) {
  const graph = useMemo(() => genGraph(data, limits), [data, limits])
  const y = scaleLinear().domain([0, graph.max]).range([height, 25])
  const targetY = y(target?.value)
  const dir = target?.direction === "at least" ? 1 : -1
  let targetColor = '#850000'
  let lineColor = target ? '#E43F3F' : '#d7d7d7'
  // @ts-ignore
  if(dir*graph.last?.value >= dir*target?.value) {
    targetColor = '#0A7600'
    lineColor = '#53C041'
  }

  return (
    <XStack pl={FONT_SIZE}>
      <SizableText rotateZ='-90deg' position='absolute' left={-20} top={50} fos={FONT_SIZE}>{yunits}</SizableText>
      <Svg width={width} height={height} fill='#636363'>
        <G y={-bottomPadding}>
          <Line
            x1={leftPadding}
            y1={height}
            x2={width}
            y2={height}
            stroke={axisLineColor}
            strokeWidth="1"
          />
          <Text fontFamily='Inter, sans-serif' fontSize={13} x={leftPadding} y={height - 2}>
            {limits?.min != undefined ? limits.min : 0}
          </Text>
          {target != undefined && <>
            <Line
              x1={leftPadding}
              y1={targetY}
              x2={width}
              y2={targetY}
              stroke={targetColor}
              strokeWidth="1"
            />
            <Text fontFamily='Inter, sans-serif' fontSize={13} x={leftPadding} y={targetY - 2} fill={targetColor}>
              {target.value}
            </Text>
          </>}
          <Line
            x1={leftPadding}
            y1={height * 0.2}
            x2={width}
            y2={height * 0.2}
            stroke={axisLineColor}
            strokeWidth="1"
          />
          <Text fontFamily='Inter, sans-serif' fontSize={13} x={leftPadding} y={height * 0.2 - 2}>
            {limits?.max != undefined ? limits.max : graph.max}
          </Text>
          <Path d={graph.curve} strokeWidth="4" fillOpacity={0}
            stroke={lineColor} strokeLinecap='round'/>
            {/* '#89FBA9' : 'FFB0B0' */}
        </G>
      </Svg>
    </XStack>
  )
}

function genGraph(data: Array<CellPoint>, limits?: Limits) {
  const max = limits?.max != undefined ? limits.max : _.max(data.map(val => val.value));
  const min = limits?.min != undefined ? limits.min : _.min(data.map(val => val.value));
  const y = scaleLinear().domain([0, max]).range([GRAPH_HEIGHT, 25]);

  const x = scaleTime()
    .domain([new Date(data[data.length - 1].timestamp), new Date()])
    .range([10, GRAPH_WIDTH - 10]);

  const curvedLine = line<CellPoint>()
    .defined(d => d.value)
    .x(d => x(new Date(d.timestamp)))
    .y(d => y(d.value))
    .curve(curveBumpX)(data);

  return {
    max,
    min,
  // @ts-ignore
    last: data[data.findIndex(p => p.value)],
    curve: curvedLine!,
  };
};