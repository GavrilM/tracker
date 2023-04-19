import { XCircle } from '@tamagui/lucide-icons';
import { useEffect, useState } from 'react'
import { Input, InputProps, Label, YStack, ZStack, useSafeRef } from "tamagui";

type TextInputProps = {
  placeholder: string,
  onChangeText?: (string) => void,
  validate?: (string) => boolean,
  inputProps: InputProps
}

export function TextInput({placeholder, onChangeText, validate, inputProps}: TextInputProps) {
  const inputRef = useSafeRef<any>(null)
  const handleFocus = () => inputRef.current?.focus()
  const handleChange = text => {
    setValue(text)
    if(onChangeText)
      onChangeText(text)
  }
  const handleBlur = () => {
    setFocused(false)
    if(validate && !validate(value)) {
      // show error
    }
  }

  const [isFocused, setFocused] = useState(true)
  const [value, setValue] = useState('')
  
  useEffect(() => { 
    if(isFocused)
      handleFocus()
  })
  let labelStyle = {
    mt: '$-2',
    fos: '$2.5'
  }
  let borderStyle = {
    outlineWidth: 4,
    boc: 'blue'
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
      boc: 'black'
    }
  }
  
  return (
    <YStack f={1} onFocus={handleFocus} onPress={handleFocus}
      height={80} bw={2} br={16} pl='$3' outlineColor="rgba(0,0,255,.5)" outlineStyle="solid" {...borderStyle}>
      <ZStack>
        <Label {...labelStyle} color="grey">{placeholder}</Label>
        <Input ref={inputRef} value={value} {...inputProps}
          unstyled color="black" mt='$6' mb='$2' fos={30}
          onFocus={() => setFocused(true)} onBlur={handleBlur} onChangeText={handleChange}/>
      </ZStack>
      {value.length > 0 &&
        <YStack onPress={e => setValue('')} 
          style={{top: 27, right: 10, position:'absolute'}}>
          <XCircle color="grey"/>
        </YStack>
      }
    </YStack>
  )
}
