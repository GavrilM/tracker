import { Check } from "@tamagui/lucide-icons"
import { XStack } from "tamagui"
import { CellCategories, getCategoryColor } from "./CellTypes"


function Option({ selected, color, onPress }) {
  return (
    <XStack jc='center' ai='center' bc={color} br={12} onPress={onPress}
      height={60} width={60} boc={selected ? 'white' : '$gray8'} bw={2}>
      {selected && <Check/>}
    </XStack>
  )
}

type ColorPickerProps = {
  selectedColor: string,
  onSelect: (color) => void
}

export function ColorPicker({ selectedColor, onSelect }: ColorPickerProps) {
  let color = ''
  const options = Object.values(CellCategories)
    .map((cat, i) => {
      if(!color && selectedColor === cat )
        color = cat
      return (
        <Option key={i} onPress={() => onSelect(cat)}
          color={getCategoryColor(cat)} selected={selectedColor === cat}/>)
    })

  return (
    <XStack space jc='center' ai='center'>
      {options}
    </XStack>
  )
}