import { XCircle } from '@tamagui/lucide-icons';
import { useEffect, useState } from 'react'
import { Input, InputProps, Label, SizableText, YStack, ZStack, useSafeRef } from "tamagui";
import { getLabelColor, getOutlineColor } from './utils';
import { ErrorText } from './ErrorText';

type TextInputProps = {
  autofocus?: boolean,
  defaultValue?: string,
  placeholder: string,
  onChange: (string) => void,
  errorMessage?: string,
  inputProps?: InputProps,
  width?: number
}

export function TextInput({
  autofocus,
  defaultValue,
  placeholder,
  onChange,
  errorMessage,
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
    <YStack f={1} width='100%'>
      <YStack onFocus={handleFocus} onPress={handleFocus} width={width}
        height={80} bw={2} br={16} pl='$3' outlineColor={getOutlineColor(errorMessage)} outlineStyle="solid"
        {...borderStyle}>
        <ZStack>
          <Label {...labelStyle} color={getLabelColor(errorMessage)}>{placeholder}</Label>
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
      <ErrorText text={errorMessage}/>
    </YStack>
  )
}
