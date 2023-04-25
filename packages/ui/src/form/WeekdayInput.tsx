import { Label, SizableText, ToggleGroup, XStack } from "tamagui";

export enum Weekday {
  'sun' = 'Sunday', 
  'mon' = "Monday",
  'tue' = "Tuesday",
  'wed' = "Wednesday",
  'thu' = "Thursday",
  'fri' = "Friday",
  'sat' = "Saturday"
}

type WeekdayInputProps = {
  label: string,
  multiple?: boolean
  onChange: (any) => void
  value?: string
  values?: [string]
}

export function WeekdayInput({ label, multiple, value, values, onChange }: WeekdayInputProps) {
  const options = Object.keys(Weekday)
    .map((v,i) => (
    <ToggleGroup.Item value={v} key={i}>
      <SizableText>{v}</SizableText>
    </ToggleGroup.Item>
  ))
  return (
    <XStack>
      <Label mr={24}>{label}</Label>
      {multiple && <ToggleGroup type='multiple' value={values} onValueChange={onChange}>
        {options}
      </ToggleGroup>}
      {!multiple && <ToggleGroup type='single' value={value} onValueChange={onChange}>
        {options}
      </ToggleGroup>}
    </XStack>
  )
}