import { FormButton, FormCard, Sheet, XStack, YStack } from "@my/ui"
import { XCircle } from "@tamagui/lucide-icons"
import { WizardFlow } from "../../features/wizard/WizardTypes"
import { useState } from "react"
import { useCollectPoints } from "app/hooks"

type CollectSheetProps = {
  isOpen: boolean,
  onClose: () => void
  flow?: WizardFlow
}

export function CollectSheet({ isOpen, onClose, flow }: CollectSheetProps) {
  const [stepValue, setStepValue] = useState()
  const [errMsg, setErrMsg] = useState('')

  const [onComplete] = useCollectPoints()

  if(!flow)
    return <></>
  // @ts-ignore
  const {field, title, FormComponent, validate} = flow?.at(0)

  const handleChange = v => {
    const error = validate(v)
    if(error)
      setErrMsg(error)
    else
      setStepValue(v)
  }

  const handleExit = () => {
    setStepValue(undefined)
    onClose()
  }

  const handleComplete = () => {
    onComplete({[field]: stepValue})
    handleExit()
  }

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
          <FormButton onPress={handleExit} type="secondary" icon={XCircle}>Exit without saving</FormButton>
        </XStack>
        <YStack ai="center">
          <FormCard
            title={title}
            onComplete={handleComplete}
            disableContinue={stepValue === undefined || errMsg.length > 0}
            height={450}>
            <FormComponent onChange={handleChange} errorMessage={errMsg}
              defaultValue={stepValue} autofocus/>
          </FormCard>
          </YStack>
      </Sheet.Frame>
    </Sheet>
  )
}