import { MinusCircle, PlusCircle } from '@tamagui/lucide-icons'
import { useEffect, useState } from 'react'
import { Input, Label, SizableText, Slider, XStack, YStack } from "tamagui"

type NumberInputProps = {
  autofocus?: boolean,
  defaultValue?: number
  min?: number,
  max?: number,
  minLabel?: string,
  maxLabel?: string,
  units?: string,
  validate?: (number) => boolean
  onChange: (number) => void,
}

export function NumberInput({
  autofocus,
  defaultValue,
  min,
  minLabel,
  max,
  maxLabel,
  units,
  validate,
  onChange,
}: NumberInputProps) {
  const isNumber = v =>  !isNaN(v) && !isNaN(parseFloat(v))
  const isBounded = min != undefined && max != undefined
  //@ts-ignore
  let initalValue = defaultValue ? defaultValue : isBounded ? Math.round((max-min)/2+min) : undefined
  const stepValue = !isBounded || max-min > 10 ? 1 : .5
  
  const [value, setValue] = useState(initalValue)
  const [errorMessage, setError] = useState("")
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
  if(errorMessage)
    label = <SizableText position='absolute' color="$red10" top={56}>{errorMessage}</SizableText>
  else if (units)
    label = <Label>{units}</Label>

  useEffect(() => onChange(value), [])

  return (
    <YStack py={16} ai='center'>
      <XStack jc="center" ai="center">
        {!errorMessage && canDecrement 
          ? <XStack onPress={decrement} mr={16}><MinusCircle color='$gray10'/></XStack>
          : <XStack width={40}/>}

        <Input placeholder="#" value={value === 0 || value ? value.toString() : ''} keyboardType='numeric' onChangeText={handleChange}
          maw={80} ta="center" bc="white" color="black" bw={2} autoFocus={autofocus} 
          focusStyle={{outlineColor: 'rgb(100,100,255)', outlineStyle: 'solid', outlineWidth:4}} />

        {!errorMessage && canIncrement 
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
              onValueChange={([v]) => setValue(v)}>
              <Slider.Track>
                <Slider.TrackActive />
              </Slider.Track>
              <Slider.Thumb index={0} circular />
            </Slider>

            <SizableText ml={8}>{max}</SizableText>
          </XStack>
          {/* Slider Labels */}
          <XStack width="100%" jc="space-between">
            <SizableText>{minLabel}</SizableText>
            <SizableText>{maxLabel}</SizableText>
          </XStack>
        </YStack>
      }
    </YStack>
  )   
}