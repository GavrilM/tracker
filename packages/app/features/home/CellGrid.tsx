import { Cell, ScrollView, XStack, YStack } from "@my/ui"
import { BoardLayouts } from "app/hooks/types/Dashboard"
import { Metric } from "app/hooks/types/Metric"
import { useMemo, useState } from "react"
import { CELL_WIDTH, genInitalLayout } from "./utils"

type CellGridProps = {
  cellLayouts: BoardLayouts | null
  data: {[id: string] : Metric}
}

export const CellGrid = ({ cellLayouts, data }: CellGridProps) => {
  const [rowLen, setRowLen] = useState(0)
  const handleLayout = ({nativeEvent}) => 
    setRowLen(Math.floor((nativeEvent.layout.width - 16) / CELL_WIDTH))

  const layout = useMemo(() => 
    genInitalLayout(rowLen, Object.keys(data), cellLayouts), [rowLen, cellLayouts])
  const grid = layout.map((row, r) => {
    const cells = row.map((id, c) => {
      if(data[id])
        return (
          <XStack key={c}>
            <Cell {...data[id]} points={data[id].points_default} />
          </XStack>
        )
      else //empty space
        return <XStack key={c} width={225} height={225} opacity={0} mr="$4" mb="$4"/>
    })
    return (
      <XStack key={r} f={1} fw="wrap">
        {cells}
      </XStack>
    )
  })

  return (
    <ScrollView onLayout={handleLayout}>
      <YStack f={1}>
        {grid}
      </YStack>
    </ScrollView>
  )
}