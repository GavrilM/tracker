import { FormButton, Sheet, XStack } from "@my/ui"
import { WizardScreen } from "../../features/wizard/screen"
import { WizardType } from "../../features/wizard/WizardTypes"
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
      animationConfig={{
        type: 'spring',
        damping: 40,
        stiffness: 450,
      }}>
      <Sheet.Overlay />
      <Sheet.Handle bc='white'/>
      <Sheet.Frame>
        <XStack jc="flex-end" p="$4">
          <FormButton onPress={onClose} type="secondary" icon={XCircle}>Exit without saving</FormButton>
        </XStack>
        {isOpen && <WizardScreen wizardType={WizardType.metric} onComplete={onClose}/>}
      </Sheet.Frame>
    </Sheet>
  )
}