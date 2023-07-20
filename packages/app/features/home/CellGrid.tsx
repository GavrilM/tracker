import { Cell, ScrollView, XStack, YStack } from "@my/ui"
import { BoardColors, BoardLayouts } from "app/hooks/types/Dashboard"
import { Metric } from "app/hooks/types/Metric"
import { useMemo, useState } from "react"
import { CELL_WIDTH, genInitalLayout } from "./utils"
import { genQuestions, getCurrentDate } from "app/hooks/common"
import { CollectSheet } from "../../components/sheets/CollectSheet"
import { CollectFlow } from "../wizard/CollectFlow"
import { WizardFlow } from "../wizard/WizardTypes"

type CellGridProps = {
  cellColors: BoardColors
  cellLayouts: BoardLayouts | null
  data: {[id: string] : Metric}
}

export const CellGrid = ({ cellColors, cellLayouts, data }: CellGridProps) => {
  const [rowLen, setRowLen] = useState(0)
  const [sheetFlow, setSheetFlow] = useState<WizardFlow | undefined>()

  const handleLayout = ({nativeEvent}) => 
    setRowLen(Math.floor((nativeEvent.layout.width - 16) / CELL_WIDTH))

  const layout = useMemo(() => 
    genInitalLayout(rowLen, Object.keys(data), cellLayouts), [rowLen, cellLayouts])
  const collectables = new Set(
    genQuestions(Object.values(data), getCurrentDate())
      .map(m => m._id))
  
  const grid = layout.map((row, r) => {
    const cells = row.map((id, c) => {
      if(data[id])
        return (
          <XStack key={c}>
            <Cell {...data[id]} points={data[id].points_default} 
              collectable={collectables.has(id)} category={cellColors[id]}
              onCollect={() => setSheetFlow(CollectFlow([data[id]]))}/>
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
    <>
      <ScrollView onLayout={handleLayout}>
        <YStack f={1}>
          {grid}
        </YStack>
      </ScrollView>

      <CollectSheet isOpen={sheetFlow != undefined} flow={sheetFlow}
        onClose={() => setSheetFlow(undefined)}/>
    </>
  )
}