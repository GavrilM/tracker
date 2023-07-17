import { CELL_SIZE, Card, EditCell, ScrollView, XStack, YStack, ZStack } from "@my/ui"
import { BoardLayouts } from "app/hooks/types/Dashboard";
import { Metric } from "app/hooks/types/Metric";
import { useEffect, useRef, useState } from "react";
import { Animated, PanResponder } from "react-native"
import { cloneDeep } from "@apollo/client/utilities";
import { EventEmitter } from 'events'
import { CELL_WIDTH, genInitalLayout } from "./utils";
import { useSaveLayout } from "app/hooks";
import { NavActionState, useSetNavAction } from "app/provider/context/NavActionContext";

const FILLER = 'filler'
const FillerCell = (props) => (
  <Card {...props} size="$4" theme="alt1"
    bordered width={CELL_SIZE} height={CELL_SIZE} mr="$4" mb="$4"/>)

const SCROLL_AREA_SIZE = 150
const SCROLL_RATE = 40
const SCROLL_INC = Math.round(CELL_WIDTH/2) 

type Coord = [number, number]

type EditableCellGridProps = {
  cellLayouts: BoardLayouts | null
  data: {[id: string] : Metric}
}

let scrollLock = true
let scrollDir = 0

export const EditableCellGrid = ({ cellLayouts, data }: EditableCellGridProps) => {
  const [saveLayout] = useSaveLayout()
  const setNavAction = useSetNavAction()

  const scrollView = useRef(null)
  const gridLayout = useRef({
    position: {top: 0, left: 0, height: 0},
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
    scrollLock = false
  }, [rowLen])
  useEffect(() => {
    setNavAction({
      save: () => {
        saveLayout(rowLen, tempLayout)
        setNavAction({state: NavActionState.None})
      }
    })
  }, [rowLen, tempLayout])

  const handleLayout = ({nativeEvent}) => {
    gridLayout.current.position = nativeEvent.layout
    setRowLen(Math.floor((nativeEvent.layout.width - 16) / CELL_WIDTH))
  }


  const handleScroll = ({nativeEvent}) => {
    gridLayout.current.scrollTop = nativeEvent.contentOffset.y
  }
  const scroll = () =>
    setTimeout(() => {
      const {scrollTop} = gridLayout.current
      scrollLock = false
      // @ts-ignore
      scrollView.current?.scrollTo({
        y: scrollTop + SCROLL_INC * scrollDir,
        animated: true
      })
      if(selectedId && scrollDir)
        scroll()
    }, SCROLL_RATE)


  const onCellPressIn = ({ nativeEvent }, [r,c]) => {
    const {scrollTop} = gridLayout.current
    const id = tempLayout[r][c]
    if(id) {
      setSelectedId(id)
      const newLayout = cloneDeep(tempLayout)
      newLayout[r][c] = FILLER
      setLastLayout(newLayout)
      setTempLayout(newLayout)
      setHoverCoord([r,c])
      pan.x.setValue(nativeEvent.clientX - CELL_WIDTH + 32)
      pan.y.setValue(nativeEvent.clientY - CELL_WIDTH + scrollTop)
    }
  }
  const onCellPressOut = () => {
    setTempLayout(genFinalLayout(tempLayout, selectedId))
    setSelectedId('')
  }
  
  const pan = useRef(new Animated.ValueXY()).current;
  const panResponder = useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder: () => true,
      onPanResponderMove: (e, state) => {
        const {position, scrollTop} = gridLayout.current
        pan.x.setValue(state.moveX - CELL_WIDTH + 32)
        pan.y.setValue(state.moveY - CELL_WIDTH + scrollTop)
        const x = state.moveX - position.left
        const y = state.moveY - position.top 
        const c = Math.max(Math.floor(x / CELL_WIDTH), 0)
        const r = Math.max(Math.floor((y + scrollTop) / CELL_WIDTH), 0)
        pressEvents.emit('hovered', [r,c])
        if(y < SCROLL_AREA_SIZE)
          pressEvents.emit('scroll.up')
        else if(y > position.height - SCROLL_AREA_SIZE)
          pressEvents.emit('scroll.down')
        else
          pressEvents.emit('scroll.stop')
      },
      onPanResponderRelease: () => {
        pressEvents.emit('release')
        pressEvents.emit('scroll.stop')
      },
    }),
  ).current; 

  useEffect(() => {
    pressEvents.removeAllListeners('hovered')
    pressEvents.addListener('hovered', ([r,c]) => {
      if(selectedId && (r !== hoverCoord[0] || c !== hoverCoord[1])) {
        setHoverCoord([r,c])
        const newLayout = genLayoutPreview(lastLayout, [r,c], rowLen)
        setTempLayout(newLayout)
      }
    })
  }, [hoverCoord, lastLayout, rowLen, selectedId])
  useEffect(() => {
    pressEvents.removeAllListeners('release')
    pressEvents.addListener('release', onCellPressOut)
  }, [tempLayout, selectedId])
  useEffect(() => {
    pressEvents.removeAllListeners('scroll.up')
    pressEvents.removeAllListeners('scroll.down')
    pressEvents.addListener('scroll.up', () => {
      scrollDir = -1
      if(!scrollLock) {
        scrollLock = true
        scroll()
      }
    })
    pressEvents.addListener('scroll.down', () => {
      scrollDir = 1
      if(!scrollLock) {
        scrollLock = true
        scroll()
      }
    })
  }, [selectedId])
  useEffect(() => {
    pressEvents.addListener('scroll.stop', () => {scrollDir = 0})
  }, [])


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
            <EditCell {...data[id]}/>
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
      <ZStack zIndex={100} position="absolute" pointerEvents="none">
        {selectedId.length > 0 && <Animated.View
          style={{
            transform: [{translateX: pan.x}, {translateY: pan.y}, {rotateZ: '10deg'}],
            opacity: .9,
          }}>
            <XStack><EditCell {...data[selectedId]} /></XStack>
          </Animated.View>}
      </ZStack>
      <YStack f={1}>
        {grid}
      </YStack>
    </ScrollView>
  )
}


// Layout functions

const genLayoutPreview = (layout: string[][], target: Coord, rowLen: number) => {
  if(target[0] >= layout.length || target[1] >= rowLen)
    return layout
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

const getIndex = ([r,c]: Coord, rowLen) => r*rowLen + c

const getCoord = (i, rowLen): Coord => [Math.floor(i/rowLen), i % rowLen]

const clipped = (x,low, high) => Math.min(Math.max(x, low), high)