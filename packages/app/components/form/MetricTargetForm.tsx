import { BinaryInput, ErrorText, MetricType, NumberInput, SelectInput, SizableText, YStack } from "@my/ui"
import { TargetDirection } from "app/hooks/types/Metric"
import { useState } from "react"

export const MetricTargetForm = ({ onChange, defaultValue, errorMessage, autofocus, forwardProps }) => {
  const {question, limits, units, view} = forwardProps
  const handleChange = (fn, field) => v => {
    fn(v)
    onChange(Object.assign({
      direction,
      value
    }, { [field]: v }))
  }

  const [direction, setDirection] = useState(defaultValue?.direction || TargetDirection.AtLeast)
  const [value, setValue] = useState(defaultValue?.value)

  let input = (
    <YStack f={1} ai="center">
      <SelectInput placeholder="Direction" width={120} onChange={handleChange(setDirection, 'direction')}
        values={Object.values(TargetDirection)} value={direction}/>
      <NumberInput  defaultValue={value} onChange={handleChange(setValue, 'value')}
        autofocus={autofocus}  {...limits} units={units} nodefault/>
    </YStack>
  )
  if(view.type === MetricType.streak)
    input = <BinaryInput onChange={handleChange(setValue, 'value')}
      defaultValue={value != undefined ? value : 1}/>

  return (
    <YStack f={1} ai="center">
      <SizableText fontStyle="italic" mb={24} fos={20}>{question}</SizableText>
      {input}
      <ErrorText text={errorMessage}/>
    </YStack>
  )
}