import { Label, RadioGroup, XStack } from "tamagui";
import { useEffect, useState } from "react"

type BinaryInputProps = {
  defaultValue?: number
  yesLabel?: string
  noLabel?: string
  onChange: (number) => void
}

export function BinaryInput({ defaultValue, yesLabel, noLabel, onChange }: BinaryInputProps) {
  const [bit, setBit] = useState(defaultValue)
  const handleChange = v => {
    const value = parseInt(v)
    onChange(value)
    setBit(value)
  }

  useEffect(() => onChange(bit), [])

  return (
    <RadioGroup value={bit?.toString()} onValueChange={handleChange}>
      <XStack width={300} alignItems="center" space="$4">
        <RadioGroup.Item value='0' id="no">
          <RadioGroup.Indicator />
        </RadioGroup.Item>
        <Label htmlFor="no">{noLabel ? noLabel : "No"}</Label>
      </XStack>
      <XStack width={300} alignItems="center" space="$4">
        <RadioGroup.Item value='1' id="yes">
          <RadioGroup.Indicator />
        </RadioGroup.Item>
        <Label htmlFor="yes">{yesLabel ? yesLabel : "Yes"}</Label>
      </XStack>
    </RadioGroup>
  )
}