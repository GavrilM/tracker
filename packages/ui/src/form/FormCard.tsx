import { Form, SizableText, XStack, YStack } from "tamagui";
import { ArrowLeftCircle, ArrowRightCircle, CheckCircle, CornerUpRight } from "@tamagui/lucide-icons"
import { FormButton } from "./FormButton";

type FormCardProps = {
  title: string,
  subtitle?: string,
  children: React.ReactNode
  onContinue?: () => void
  onBack?: () => void
  onSkip?: () => void
  onComplete?: () => void
  completeText?: string,
  height?: number | string
  center?: boolean
}

export function FormCard({ 
  title, 
  subtitle, 
  children,
  onContinue,
  onBack,
  onSkip,
  onComplete,
  completeText,
  height,
  center
}: FormCardProps) {
  const handleSubmit = () => {
    if(onComplete)
      onComplete()
    else if(onContinue)
      onContinue()
  }

  return (
    <YStack >
      <Form onSubmit={handleSubmit}>
        <YStack bc="$gray3" p={25} br={12} w={450} h={height || 420}>
          <SizableText fow='700' fos='$7' textAlign={center ? 'center' : "auto"}>{title}</SizableText>
          <SizableText mt={12} lineHeight={20}>{subtitle}</SizableText>
          <YStack f={1} my={16} ai='center'>{children}</YStack>
          <XStack space fd="row-reverse">
            {onComplete && 
                <FormButton type="save" icon={CheckCircle} onPress={onComplete}>{completeText || 'Save'}</FormButton>}
            {onContinue && 
              <Form.Trigger asChild>
                <FormButton type="primary" icon={ArrowRightCircle} onPress={onContinue}>Continue</FormButton>
              </Form.Trigger>}
            {onSkip && <FormButton type="discourage" icon={CornerUpRight} onPress={onSkip}>Skip</FormButton>}
            {onBack && <FormButton type="secondary" icon={ArrowLeftCircle} onPress={onBack}>Back</FormButton>}
          </XStack>
        </YStack>
      </Form>
    </YStack>
  )
}