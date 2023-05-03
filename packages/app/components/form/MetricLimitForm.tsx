import { ErrorText, Label, NumberInput, SizableText, TextInput, XStack, YStack } from "@my/ui"
import { useState } from "react"

export const MetricLimitForm = ({ defaultValue, onChange, errorMessage }) => {
  const handleChange = (fn, field) => v => {
    fn(v)
    onChange(Object.assign({
      min,
      min_label,
      max,
      max_label
    }, { [field]: v }))
  }

  const [min, setMin] = useState(defaultValue?.min)
  const [min_label, setMinLabel] = useState(defaultValue?.min_label)
  const [max, setMax] = useState(defaultValue?.max)
  const [max_label, setMaxLabel] = useState(defaultValue?.max_label)

  return (
    <YStack ai='center'>
      <Label jc="center">On the scale of:</Label>
      {errorMessage && <ErrorText text={errorMessage}/>}
      <XStack>
        <NumberInput defaultValue={min} onChange={handleChange(setMin, 'min')} autofocus />
        <YStack height={70} jc="center" px={16}><SizableText fow='700'>to</SizableText></YStack>
        <NumberInput defaultValue={max} onChange={handleChange(setMax, 'max')}/>
      </XStack>
      <XStack space f={1}>
        <TextInput defaultValue={min_label} placeholder="Min Label" 
          onChange={handleChange(setMinLabel, 'min_label')} width={200}/>
        <TextInput defaultValue={max_label} placeholder="Max Label"
          onChange={handleChange(setMaxLabel, 'max_label')} width={200}/>
      </XStack>
    </YStack>
  )
}