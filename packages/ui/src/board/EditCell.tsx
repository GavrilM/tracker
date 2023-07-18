import { Button, Card, SizableText, XStack, YStack } from "tamagui";
import { LinearGradient } from '@tamagui/linear-gradient'
import { CELL_SIZE, CellCategories, getCategoryColor } from "./CellTypes";
import _ from "lodash"
import { Edit2, Move } from "@tamagui/lucide-icons";

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
  category: CellCategories,
  onEdit?: () => void,
  onPressIn: (e) => void,
  onPressOut: () => void
}

const SUMMARY_HEIGHT = 80

export function EditCell({ name, category, onEdit, onPressIn, onPressOut }: EditCellProps) {
  return (
    <Card size="$4" bordered width={CELL_SIZE} height={CELL_SIZE} theme="alt1" bc={getCategoryColor(category)}
      mr="$4" mb="$4" py={16} pb={0}>
      <YStack f={1} ai="center" jc='space-between' onPressIn={onPressIn} onPressOut={onPressOut}>
        <SizableText fow='700' color='rgba(255,255,255, .9)' selectable={false}>{name}</SizableText>

        <XStack f={1} ai='center'>
          <Move/>
        </XStack>
      </YStack>
      {onEdit && <XStack width="100%" space>
        <Button f={1} height={60} bc="rgba(224,224,224,.1)" hoverStyle={{bc: '$blue10'}}
            onPress={onEdit}>
          <Edit2 color="rgba(225,225,225,.7)"/>
        </Button>
        <Button f={1} height={60} bc="rgba(224,224,224,.1)" hoverStyle={{bc: '$blue10'}}
            onPress={() => console.log('col')}>
          <LinearGradient width={40} height={40} br={10} start={[0,0]} end={[1,1]}
            colors={['$red10', '$yellow9', '$green10', '#3C72FF', '$pink8']}
            locations={[.14,.33,.5,.66,.85]}
            jc="center" ai="center">
            <XStack width={30} height={30} bc={getPreviewColor(category)} br={10} 
              top={5} left={5} boc="white" bw={2}/>
          </LinearGradient>
        </Button>
      </XStack>}
      
    </Card>
  )
}

export function getPreviewColor(category: CellCategories) {
  switch(category) {
    case CellCategories.red:
      return '$red10'
    case CellCategories.orange:
      return '$orange10'
    case CellCategories.yellow:
      return '$yellow9'
    case CellCategories.green:
      return '$green10'
    case CellCategories.blue:
      return '$blue10'
    case CellCategories.indigo:
      return '#0784BA'
    case CellCategories.purple:
      return '$purple10'
    case CellCategories.pink:
      return '$pink10'
    default:
      return 'black'
  }
}
