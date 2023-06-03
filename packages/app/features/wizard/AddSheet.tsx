import { FormButton, Sheet, XStack } from "@my/ui"
import { WizardScreen } from "./screen"
import { WizardType } from "./WizardTypes"
import { XCircle } from "@tamagui/lucide-icons"

type AddSheetProps = {
  isOpen: boolean,
  onClose: () => void
}

export function AddSheet({ isOpen, onClose }: AddSheetProps) {

  return (
    <Sheet modal open={isOpen} snapPoints={[90, 40]}
      onOpenChange={o => o ? null : onClose()}
      dismissOnSnapToBottom
      zIndex={100_000}
      animation="bouncy"
    >
      <Sheet.Overlay />
      <Sheet.Handle />
      <Sheet.Frame>
        <XStack jc="flex-end" p="$4">
          <FormButton onPress={onClose} type="secondary" icon={XCircle}>Exit without saving</FormButton>
        </XStack>
        <WizardScreen wizardType={WizardType.metric} onComplete={onClose}/>
      </Sheet.Frame>
    </Sheet>
  )
}