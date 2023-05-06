import { Card, Cell, ScrollView, Spinner, XStack, YStack, ZStack } from "@my/ui"
import { useMetrics } from "app/hooks"
import { CellLayout } from "app/hooks/types/Dashboard";
import { DummyMetric, Metric } from "app/hooks/types/Metric";
import { useEffect, useRef, useState } from "react";
import { Animated, PanResponder } from "react-native"
import { cloneDeep } from "@apollo/client/utilities";
import { EventEmitter } from 'events'

const CELL_WIDTH = 243
const FILLER = 'filler'
const FillerCell = (props) => (
  <Card {...props} size="$4" theme="alt1"
    bordered width={225} height={225} mr="$4" mb="$4"/>)

type Coord = [number, number]

type CellGridProps = {
  cellLayouts?: Array<CellLayout>
  data: {[id: string] : Metric}
}

export const CellGrid = ({ cellLayouts, data }: CellGridProps) => {
  // TODO: change query to not load default_points
  const scrollView = useRef(null)
  const gridLayout = useRef({
    position: {top: 0, left: 0},
    scrollTop: 0
  })
  const pressEvents = useRef(new EventEmitter()).current

  const [rowLen, setRowLen] = useState(0)
  const [selectedId, setSelectedId] = useState('')
  let [hoverCoord, setHoverCoord] = useState<Coord>([0,0])

  const [tempLayout, setTempLayout] = useState([['']])
  const [lastLayout, setLastLayout] = useState([['']])
  useEffect(() => {
    setTempLayout(genInitalLayout(rowLen, Object.keys(data), cellLayouts))
  }, [rowLen])

  const handleLayout = ({nativeEvent}) => {
    gridLayout.current.position = nativeEvent.layout
    setRowLen(Math.floor((nativeEvent.layout.width - 16) / CELL_WIDTH))
  }
  const handleScroll = ({nativeEvent}) => {
    gridLayout.current.scrollTop = nativeEvent.contentOffset.y
  }

  const onCellPressIn = (e, [r,c]) => {
    const id = tempLayout[r][c]
    if(id) {
      setSelectedId(id)
      const newLayout = cloneDeep(tempLayout)
      newLayout[r][c] = FILLER
      setLastLayout(newLayout)
      setTempLayout(newLayout)
      setHoverCoord([r,c])
    }
  }
  const onCellPressOut = () => {
    setTempLayout(genFinalLayout(tempLayout, selectedId))
    setSelectedId('')
  }
  
  const panResponder = useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder: () => true,
      onPanResponderMove: (e, state) => {
        const {position, scrollTop} = gridLayout.current
        const x = state.moveX - position.left
        const y = state.moveY - position.top + scrollTop
        const c = Math.floor(x / CELL_WIDTH)
        const r = Math.floor(y / CELL_WIDTH)
        pressEvents.emit('hovered', [r,c])
      },
      onPanResponderRelease: () => {
        pressEvents.emit('release')
      },
    }),
  ).current; 

  useEffect(() => {
    pressEvents.removeAllListeners('hovered')
    pressEvents.addListener('hovered', ([r,c]) => {
      if(r !== hoverCoord[0] || c !== hoverCoord[1]) {
        setHoverCoord([r,c])
        const newLayout = genLayoutPreview(lastLayout, [r,c], rowLen)
        setTempLayout(newLayout)
      }
    })
  }, [hoverCoord, lastLayout, rowLen])
  useEffect(() => {
    pressEvents.removeAllListeners('release')
    pressEvents.addListener('release', onCellPressOut)
  }, [tempLayout, selectedId])


  const grid = tempLayout.map((row, r) => {
    const cells = row.map((id, c) => {
      const props = {
        onPressIn: e => onCellPressIn(e,[r,c]),
        onPressOut: e => onCellPressOut()
      }
      if(id === FILLER)
        return <FillerCell key={c} {...props}/>
      if(data[id])
        return (
          <XStack key={c} {...props}>
            <Cell {...data[id]} points={[]} />
          </XStack>
        )
      else //empty space
        return <XStack key={c} {...props} width={225} height={225} opacity={0} mr="$4" mb="$4"/>
    })
    return (
      <XStack key={r} f={1} fw="wrap">
        {cells}
      </XStack>
    )
  })
  
  return (
    <ScrollView {...panResponder.panHandlers} f={1} ref={scrollView}
      onLayout={handleLayout} onScroll={handleScroll} scrollEventThrottle={25}>
      <YStack f={1}>
        {grid}
      </YStack>
    </ScrollView>
  )
}

const genLayoutPreview = (layout: string[][], target: Coord, rowLen: number) => {
  const newLayout = cloneDeep(layout)
  let fillerCoord: Coord = [rowLen - 1, rowLen - 1]
  layout.forEach((row, r) => row.forEach((col, c) => {
    if(col === FILLER)
      fillerCoord = [r,c]
  }))
  newLayout[fillerCoord[0]][fillerCoord[1]] = ''

  let t = getIndex(target, rowLen)
  let f = getIndex(fillerCoord, rowLen)
  let next = layout[target[0]][target[1]]
  const dir = t < f ? 1 : -1
  const inc = target[1] === fillerCoord[1] ? rowLen : 1
  t += inc*dir
  while(dir*t <= dir*f) {
    if(!next)
      break
    const [y,x] = getCoord(t, rowLen)
    newLayout[y][x] = next
    next = layout[y][x]
    t += inc*dir
  }
  newLayout[target[0]][target[1]] = FILLER
  return newLayout
}

const genFinalLayout = (layout: string[][], id) => {
  const newLayout = cloneDeep(layout)
  layout.forEach((row, r) => row.forEach((col, c) => {
    if(col === FILLER)
      newLayout[r][c] = id
  }))
  if(!newLayout.at(-1)?.every(s => !s))
    newLayout.push(newLayout[0].map(() => ''))
  return newLayout
}

const genInitalLayout = (rowLen, ids: Array<string>, cellLayouts?: Array<CellLayout>, ) => {
  if(!rowLen)
    return []
  if(cellLayouts) {
    const i = cellLayouts.findIndex(l => l.row_len === rowLen)
    if(i !== -1)
      return cellLayouts[i].grid
  }
  const init = genMatrix(ids, rowLen)
  init.push(init[0].map(() => ''))
  return init
}

const genMatrix = (strs, rowLen) => {
  const mat: string[][] = []
  strs.forEach((s,i) => {
    if(i % rowLen === 0) 
      mat.push([s])
    else
      mat.at(-1)?.push(s)
  })
  return mat
}

const getIndex = ([r,c]: Coord, rowLen) => r*rowLen + c

const getCoord = (i, rowLen): Coord => [Math.floor(i/rowLen), i % rowLen]