import { Label, SizableText, ToggleGroup, XStack } from "tamagui";
import { getOutlineColor } from "./utils";
import { ErrorText } from "./ErrorText";

export enum Weekday {
  Monday,
  Tuesday,
  Wednesday,
  Thursday,
  Friday,
  Saturday,
  Sunday, 
}

type WeekdayInputProps = {
  label: string,
  multiple?: boolean
  onChange: (any) => void
  value?: number
  values?: [number]
  errorMessage?: string,
}

export function WeekdayInput({ label, multiple, value, values, onChange, errorMessage }: WeekdayInputProps) {
  const handleChange = v => {
    if(typeof v === 'string') {
      onChange(parseInt(v))
    } else {
      onChange(v.map(v => parseInt(v)))
    }
  }

  const options = Object.values(Weekday)
    .slice(0,7)
    .map((v,i) => (
    <ToggleGroup.Item value={i.toString()} key={i}>
      <SizableText>{v.toString().slice(0,3)}</SizableText>
    </ToggleGroup.Item>
  ))

  return (
    <XStack>
      <Label mr={24}>{label}</Label>
      {multiple && <ToggleGroup type='multiple' onValueChange={handleChange}
        value={values != undefined ? values.map(v => v.toString()) : undefined}
        outlineColor={getOutlineColor(errorMessage)} size='$4'>
        {options}
      </ToggleGroup>}
      {!multiple && <ToggleGroup type='single' onValueChange={handleChange}
        value={value != undefined ? value.toString() : undefined} size='$4'>
        {options}
      </ToggleGroup>}
      <ErrorText text={errorMessage}/>
    </XStack>
  )
}