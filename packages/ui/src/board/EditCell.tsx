import { Card, SizableText, XStack, YStack } from "tamagui";
import { CELL_SIZE, CellCategories } from "./CellTypes";
import _ from "lodash"
import { Move } from "@tamagui/lucide-icons";

export type CellPoint = {
  timestamp: string,
  value: number | undefined
}

export type Limits = {
  min: number,
  max: number
}

type EditCellProps = {
  name: string,
  category: CellCategories
}

const SUMMARY_HEIGHT = 80

export function EditCell({ name, category }: EditCellProps) {
    
  return (
    <Card size="$4" bordered width={CELL_SIZE} height={CELL_SIZE} theme="alt1" bc={getCategoryColor(category)}
      mr="$4" mb="$4" py={16}>
      <YStack f={1} ai="center" jc='space-between' pointerEvents="none" >
        <SizableText fow='700' color='rgba(255,255,255, .9)' selectable={false}>{name}</SizableText>

        <XStack f={1} ai='center'>
          <Move/>
        </XStack>
      </YStack>
    </Card>
  )
}

function getCategoryColor(category: CellCategories) {
  switch(category) {
    case CellCategories.physical:
      return '#3D2119'
    case CellCategories.emotional:
      return '#403005'
    case CellCategories.relationships:
      return '#3E2129'
    case CellCategories.finances:
      return '#2C3422'
    case CellCategories.work:
      return '#2B2D43'
    case CellCategories.community:
      return '#42293A'
    case CellCategories.learning:
      return '#342B3F'
    case CellCategories.creativity:
      return '#1C3339'
    case CellCategories.spirituality:
      return '#373219'
    case CellCategories.character:
      return '#29352F'
  }
}
