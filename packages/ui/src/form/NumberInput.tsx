import { MinusCircle, PlusCircle } from '@tamagui/lucide-icons'
import { useEffect, useState } from 'react'
import { Input, Label, SizableText, Slider, XStack, YStack } from "tamagui"
import { getOutlineColor } from './utils'

type NumberInputProps = {
  autofocus?: boolean,
  defaultValue?: number,
  nodefault?: boolean,
  min?: number,
  max?: number,
  min_label?: string,
  max_label?: string,
  units?: string,
  validate?: (number) => boolean
  onChange: (number) => void,
  errorMessage?: string,
}

export function NumberInput({
  autofocus,
  defaultValue,
  nodefault,
  min,
  min_label,
  max,
  max_label,
  units,
  validate,
  onChange,
  errorMessage
}: NumberInputProps) {
  const isNumber = v =>  !isNaN(v) && !isNaN(parseFloat(v))
  const isBounded = min != undefined && max != undefined
  //@ts-ignore
  let initalValue = defaultValue != undefined
    ? defaultValue
    : isBounded && !nodefault 
      ? Math.round((max-min)/2+min)
      : undefined
  const stepValue = !isBounded || max-min > 10 ? 1 : .5
  
  const [value, setValue] = useState(initalValue)
  const [errorMsg, setError] = useState(errorMessage || "")
  //@ts-ignore 
  const canDecrement = isNumber(value) && (min == undefined || value - stepValue >= min)
  //@ts-ignore
  const canIncrement = isNumber(value) && (max == undefined ||  value + stepValue <= max)

  const saveValue = v => {
    setValue(v)
    onChange(v)
  }
  //@ts-ignore 
  const decrement = () => saveValue(canDecrement ? value - stepValue : value)
  //@ts-ignore 
  const increment = () => saveValue(canIncrement ? value + stepValue : value)
  const handleChange = v => {
    if(v === ""){
      setError("")
      saveValue(undefined)
      return
    } else if (!isNumber(v)){
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
    saveValue(newValue)
  }

  const sliderValue = value ? [value] : undefined
  let label = <></>
  if(errorMsg)
    label = <SizableText position='absolute' color="$red10" top={60}>{errorMsg}</SizableText>
  else if (units)
    label = <Label>{units}</Label>

  useEffect(() => onChange(value), [])

  return (
    <YStack py={16} ai='center'>
      <XStack jc="center" ai="center">
        {!errorMsg && canDecrement 
          ? <XStack onPress={decrement} mr={16}><MinusCircle color='$gray10'/></XStack>
          : <XStack width={40}/>}

        <Input placeholder="#" value={value === 0 || value ? value.toString() : ''} keyboardType='numeric' onChangeText={handleChange}
          maw={80} ta="center" bc="white" color="black" bw={2} autoFocus={autofocus} 
          focusStyle={{outlineColor: getOutlineColor(errorMsg), outlineStyle: 'solid', outlineWidth:4}} />

        {!errorMsg && canIncrement 
          ? <XStack onPress={increment} ml={16}><PlusCircle color='$gray10'/></XStack>
          : <XStack width={40}/>}
      </XStack>

      {label}

      {isBounded &&
        <YStack f={1} mt={16} ai="center">
          {/* Slider */}
          <XStack f={1} ai="center">
            <SizableText mr={8}>{min}</SizableText>

            <Slider min={min} max={max} step={stepValue}
              defaultValue={sliderValue} value={sliderValue}
              width={250}
              onValueChange={handleChange}>
              <Slider.Track bc="$gray10" height="$1">
                <Slider.TrackActive />
              </Slider.Track>
              <Slider.Thumb index={0} circular />
            </Slider>

            <SizableText ml={8}>{max}</SizableText>
          </XStack>
          {/* Slider Labels */}
          <XStack width="100%" jc="space-between">
            <SizableText>{min_label}</SizableText>
            <SizableText>{max_label}</SizableText>
          </XStack>
        </YStack>
      }
    </YStack>
  )   
}