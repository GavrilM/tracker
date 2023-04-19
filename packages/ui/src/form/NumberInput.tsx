import { MinusCircle, PlusCircle } from '@tamagui/lucide-icons'
import { useState } from 'react'
import { Input, SizableText, Slider, XStack, YStack } from "tamagui"

type NumberInputProps = {
  min?: number,
  max?: number,
  minLabel?: string,
  maxLabel?: string,
  units?: string,
  validate?: (string) => boolean
}

export function NumberInput({
  min,
  minLabel,
  max,
  maxLabel,
  units,
  validate
}: NumberInputProps) {
  const isBounded = min != undefined && max != undefined
  const defaultValue = isBounded ? Math.round((max-min)/2) : 0
  const stepValue = !isBounded || max-min > 10 ? 1 : .5

  const [value, setValue] = useState(defaultValue)
  const [error, setError] = useState("")

  const canDecrement = min == undefined || value - stepValue >= min
  const canIncrement = max == undefined || value + stepValue <= max

  const decrement = () => setValue(canDecrement ? value - stepValue : value)
  const increment = () => setValue(canIncrement ? value + stepValue : value)
  const isNumber = v =>  v === "" || (!isNaN(v) && !isNaN(parseFloat(v)))
  const checkValid = v => {
    if(!isNumber(v)){
      return
    } else if (validate && !validate(v)) {
      setError("Please enter a valid number")
      return
    }

    const newValue = parseFloat(v)
    if (max != undefined && newValue > max) {
      setError("Too large")
    } else if (min != undefined && newValue < min) {
      setError("Too small")
    } else {
      setError("")
    }
    setValue(parseFloat(v))
  }

  return (
    <YStack py={16}>
      <XStack jc="center" ai="center">
        {!error && canDecrement && 
          <XStack onPress={decrement} mr={16}><MinusCircle color='$gray10'/></XStack>}
        <Input placeholder="#" value={value === 0 || value ? value.toString() : ''} keyboardType='numeric' onChangeText={checkValid}
          maw={60} ta="center" bc="white" color="black" bw={2} />
        {!error && canIncrement &&
          <XStack onPress={increment} ml={16}><PlusCircle color='$gray10'/></XStack>}
      </XStack>
      {error ? <SizableText color="$red10">{error}</SizableText> : <SizableText>{units}</SizableText>}
      {isBounded &&
        <YStack f={1} mt={16} ai="center">
          <XStack f={1} ai="center">
            <SizableText color="black" mr={8}>{min}</SizableText>
            <Slider min={min} max={max} step={stepValue} defaultValue={[defaultValue]} value={[value]}
              width={250}
              onValueChange={([v]) => setValue(v)}>
              <Slider.Track>
                <Slider.TrackActive />
              </Slider.Track>
              <Slider.Thumb index={0} circular />
            </Slider>
            <SizableText color="black" ml={8}>{max}</SizableText>
          </XStack>
          <XStack width="100%" jc="space-between">
            <SizableText color="black">{minLabel}</SizableText>
            <SizableText color="black">{maxLabel}</SizableText>
          </XStack>
        </YStack>
      }
    </YStack>
  )   
}