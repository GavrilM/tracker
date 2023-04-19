import { FormCard, YStack, H1, TextInput } from "@my/ui"

export const WizardScreen = () => {    
  return (
    <YStack f={1} jc="center" ai="center" p="$4">
      <YStack space="$4" maw={600}>
        <H1 ta="center">Add</H1>
        <FormCard
          title="What shall we call this Metric?"
          subtitle="Pick something short and informative"
          onContinue={() => {}}>
          <TextInput onChangeText={() => {}} placeholder="Metric name" inputProps={{autoFocus: true}}/>
        </FormCard>
      </YStack>
    </YStack>
  )
}