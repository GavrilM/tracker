import { SizableText, XStack, YStack } from "tamagui";
import { ArrowLeftCircle, ArrowRightCircle, CheckCircle, CornerUpRight } from "@tamagui/lucide-icons"
import { FormButton } from "./FormButton";

type FormCardProps = {
  title: string,
  subtitle: string,
  children: React.ReactNode,
  onContinue?: () => void
  onBack?: () => void
  onSkip?: () => void
  onComplete?: () => void
  completeText?: string,
}

export function FormCard({ 
  title, 
  subtitle, 
  children,
  onContinue,
  onBack,
  onSkip,
  onComplete,
  completeText
}: FormCardProps) {
  return (
    <YStack bc="white" p={25} br={12}>
      <SizableText color="black" fow='700' fos='$7'>{title}</SizableText>
      <SizableText color="black">{subtitle}</SizableText>
      <YStack f={1} my={16}>{children}</YStack>
      <XStack space>
        {onBack && <FormButton type="secondary" icon={ArrowLeftCircle} onPress={onBack}>Back</FormButton>}
        {onSkip && <FormButton type="discourage" icon={CornerUpRight} onPress={onSkip}>Skip</FormButton>}
        {onContinue && <FormButton type="primary" icon={ArrowRightCircle} onPress={onContinue}>Continue</FormButton>}
        {onComplete && <FormButton type="save" icon={CheckCircle} onPress={onComplete}>{completeText || 'Save'}</FormButton>}
      </XStack>
    </YStack>
  )
}