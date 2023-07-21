import { ColorPicker, FormButton, Sheet, XStack, YStack } from "@my/ui";

type ColorSheetProps = {
  isOpen: boolean,
  selectedColor: string,
  onSelect: (color) => void
  onClose: () => void
}

export function ColorSheet({ isOpen, selectedColor, onSelect, onClose }: ColorSheetProps) {

  return (
    <Sheet modal open={isOpen} snapPoints={[30]}
      onOpenChange={o => o ? null : onClose()}
      dismissOnSnapToBottom
      zIndex={100_000}
      animationConfig={{
        type: 'spring',
        damping: 40,
        stiffness: 450,
      }}>
      <Sheet.Handle bc='white'/>
      <Sheet.Frame>
        <XStack jc="flex-end" p="$4">
          <FormButton onPress={onClose} type="secondary">Done</FormButton>
        </XStack>
        <YStack ai="center">
          <ColorPicker onSelect={onSelect} selectedColor={selectedColor}/>
        </YStack>
      </Sheet.Frame>
    </Sheet>
  )
}