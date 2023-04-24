import { Check, ChevronDown, ChevronUp } from '@tamagui/lucide-icons'
import { Adapt, Select, Sheet, YStack } from 'tamagui' // or from '@tamagui/select'
import { LinearGradient } from '@tamagui/linear-gradient'

type SelectProps = {
  placeholder: string,
  value: string,
  values: Array<string>,
  onChange?: (string) => void,
  width: number
}

export const SelectInput = ({ placeholder, value, values, onChange, width }: SelectProps) => (
  <Select value={value} onValueChange={onChange}>

    <Select.Trigger width={width}>
      <Select.Value placeholder={placeholder} />
    </Select.Trigger>

    <Adapt when="sm" platform="touch">
      <Sheet modal dismissOnSnapToBottom>
        <Sheet.Frame>
          <Sheet.ScrollView>
            <Adapt.Contents />
          </Sheet.ScrollView>
        </Sheet.Frame>
        <Sheet.Overlay />
      </Sheet>
    </Adapt>

    <Select.Content zIndex={100000}>
      <Select.ScrollUpButton alignItems="center" justifyContent="center" position="relative" width="100%" height="$3">
        <YStack zIndex={10}>
          <ChevronUp size={20} />
        </YStack>
        <LinearGradient
          start={[0, 0]}
          end={[0, 1]}
          fullscreen
          colors={['$background', '$backgroundTransparent']}
          borderRadius="$4"
        />
      </Select.ScrollUpButton>


      <Select.Viewport>
        <Select.Group>

          <Select.Label>{placeholder}</Select.Label>
          {values.map((v, i) => (
            <Select.Item value={v} index={i} key={i}>
              <Select.ItemText>{v}</Select.ItemText>
              <Select.ItemIndicator marginLeft="auto">
                <Check size={16} />
              </Select.ItemIndicator>
            </Select.Item>
          ))}

        </Select.Group>
      </Select.Viewport>

      <Select.ScrollDownButton alignItems="center" justifyContent="center" position="relative" width="100%" height="$3">
        <YStack zIndex={10}>
          <ChevronDown size={20} />
        </YStack>
        <LinearGradient
          start={[0, 0]}
          end={[0, 1]}
          fullscreen
          colors={['$backgroundTransparent', '$background']}
          borderRadius="$4"
        />
      </Select.ScrollDownButton>
    </Select.Content>

  </Select>

)
