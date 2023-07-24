import { Form, H3, Paragraph, XStack, YStack } from "tamagui";
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
  disableContinue?: boolean
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
  disableContinue,
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
          <H3 mt="$2" fow='700' textAlign={center ? 'center' : "auto"}>{title}</H3>
          <Paragraph mt={16} lineHeight={20}>{subtitle}</Paragraph>
          <YStack f={1} my={30} ai='center'>{children}</YStack>
          <XStack space fd="row-reverse">
            {onComplete && 
              <FormButton type="save" icon={CheckCircle} onPress={onComplete}>{completeText || 'Save'}</FormButton>}
            {onContinue &&
              <Form.Trigger disabled={disableContinue}>
                <FormButton type={disableContinue ? "disabled" : "primary"} icon={ArrowRightCircle} 
                  onPress={onContinue}>Continue</FormButton>
              </Form.Trigger>
            }
            {onSkip && <FormButton type="discourage" icon={CornerUpRight} onPress={onSkip}>Skip</FormButton>}
            {onBack && <FormButton type="secondary" icon={ArrowLeftCircle} onPress={onBack}>Back</FormButton>}
          </XStack>
        </YStack>
      </Form>
    </YStack>
  )
}