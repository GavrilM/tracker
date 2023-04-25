import { SizableText, XStack, YStack } from "tamagui";
import { SelectInput } from "./SelectInput";
import { range } from "lodash"

type MonthDateInputProps = {
  label: string,
  onChange: (string) => void
  value: string
}

export function MonthDateInput({ label, onChange, value }: MonthDateInputProps) {
  return (
    <XStack space ai='center' jc='center'>
      <YStack height={60} jc="center">
        <SizableText fow='700'>{label}</SizableText>
      </YStack>
      <SelectInput placeholder="date" width={120} value={value}
        values={range(1,32).map(ordinalSuffix).concat(['last day'])} onChange={onChange}/>
    </XStack>
  )
}

function ordinalSuffix(i) {
  var j = i % 10,
      k = i % 100;
  if (j == 1 && k != 11) {
      return i + "st";
  }
  if (j == 2 && k != 12) {
      return i + "nd";
  }
  if (j == 3 && k != 13) {
      return i + "rd";
  }
  return i + "th";
}