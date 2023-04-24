import { XCircle } from '@tamagui/lucide-icons';
import { useEffect, useState } from 'react'
import { Input, InputProps, Label, YStack, ZStack, useSafeRef } from "tamagui";

type TextInputProps = {
  autofocus?: boolean,
  defaultValue?: string,
  placeholder: string,
  onChange: (string) => void,
  validate?: (string) => boolean,
  inputProps?: InputProps,
  width?: number
}

export function TextInput({
  autofocus,
  defaultValue,
  placeholder,
  onChange,
  validate,
  inputProps,
  width
}: TextInputProps) {
  const inputRef = useSafeRef<any>(null)
  const handleFocus = () => inputRef.current?.focus()
  const handleChange = text => {
    setValue(text)
    onChange(text)
  }
  const handleBlur = () => {
    setFocused(false)
    if(validate && !validate(value)) {
      // TODO: show error
    }
  }

  const [isFocused, setFocused] = useState(autofocus)
  const [value, setValue] = useState(defaultValue || '')
  
  useEffect(() => { 
    if(isFocused)
      handleFocus()
  })
  // TODO: replace with theme colors
  let labelStyle = {
    mt: '$-2',
    fos: '$2.5'
  }
  let borderStyle = {
    outlineWidth: 4,
  }
  if (!isFocused) {
    if (!value.length) {
      labelStyle = {
        mt: '$3.5',
        fos: '$9'
      }
    }
    borderStyle = {
      outlineWidth: 0,
    }
  }
  
  return (
    <YStack onFocus={handleFocus} onPress={handleFocus} width={width}
      height={80} bw={2} br={16} pl='$3' outlineColor="rgba(100,100,255,1)" outlineStyle="solid" {...borderStyle}>
      <ZStack>
        <Label {...labelStyle} color="grey">{placeholder}</Label>
        <Input ref={inputRef} value={value} {...inputProps}
          unstyled mt='$6' mb='$2' fos={30} pr={40}
          onFocus={() => setFocused(true)} onBlur={handleBlur} onChangeText={handleChange}/>
      </ZStack>
      {value.length > 0 &&
        <YStack onPress={e => setValue('')} 
          style={{top: 27, right: 10, position:'absolute'}}>
          <XCircle/>
        </YStack>
      }
    </YStack>
  )
}
