import { FormCard, YStack, H1, H3 } from "@my/ui"
import { useState } from "react"
import { pick } from "lodash"
import { WizardFlow, WizardType } from "./WizardTypes"
import { AddMetricFlow, AddMetricReview } from "./AddMetricFlow"
import { useCollectPoint, useCreateMetric, useUserId } from "app/hooks"
import { useRouter } from "solito/router"
import { routes } from "app/navigation/web"
import { CollectFlow, CollectReview } from "./CollectFlow"

type WizardScreenProps = {
  wizardType: WizardType,
  wizardTypes?: Array<WizardType>,
  icons?: Array<React.ReactNode>
}

const dummyMutation = () => [() => {}]

const wizards = {
  [WizardType.metric]: AddMetricFlow,
  [WizardType.collect]: CollectFlow
}

const reviewComponents = {
  [WizardType.metric]: AddMetricReview,
  [WizardType.collect]: CollectReview,
}

const useCompleteMutation = {
  [WizardType.metric]: useCreateMetric,
  [WizardType.collect]: dummyMutation,
}

const useStepMutation = {
  [WizardType.metric]: dummyMutation,
  [WizardType.collect]: useCollectPoint
}

const submitText = {
  [WizardType.metric]: "Create Cell",
  [WizardType.collect]: "Save and Exit"
}

export const WizardScreen = ({ wizardType }: WizardScreenProps) => {
  const userId = useUserId()
  const withOwnerId = o => Object.assign({owner_id: {link: userId}}, o)
  const { replace } = useRouter()

  const [completeFn] = useCompleteMutation[wizardType]()
  const [stepFn] = useStepMutation[wizardType]()
  const steps: WizardFlow = wizards[wizardType]

  const [stepNum, setStepNum] = useState(0)
  let [stepValue, setStepValue] = useState<any>()
  const [formValue, setFormValue] = useState({})
  console.log(formValue)

  const backFn = field => () => {
    if(field)
      setFormValue(Object.assign(formValue, {[field]: stepValue}))
    setStepValue(formValue[steps[stepNum - 1].field])
    setStepNum(stepNum - 1)
  }
  let content = <H3>Complete!</H3>

  if(stepNum < steps.length) {
    const { field, title, subtitle, forwardProps, FormComponent } = steps[stepNum]

    let props = forwardProps ? pick(formValue, forwardProps) : {}

    const handleContinue = () => {
      setFormValue(Object.assign(formValue, {[field]: stepValue}))
      setStepNum(stepNum + 1)
      setStepValue(formValue[steps[stepNum + 1]?.field])
      if(stepValue)
        stepFn({variables: {
          data: withOwnerId(stepValue)
        }})
    }
    const handleBack = stepNum > 0 ? backFn(field) : undefined

    content = (
      <>
        <H1 ta="center">Step {stepNum + 1} of {steps.length}</H1>
        <FormCard
          title={title}
          subtitle={subtitle}
          onBack={handleBack}
          onContinue={handleContinue}>
          <FormComponent onChange={v => {stepValue = v}} 
            defaultValue={stepValue} forwardProps={props}/>
        </FormCard>
      </>
    )
  } else if (stepNum === steps.length) {
    const Review = reviewComponents[wizardType]
    content = (
      <FormCard
        title={'Review'}
        onBack={backFn(false)}
        onComplete={() => {
          completeFn({variables: {
            data: withOwnerId(formValue) 
          }})
          replace(routes.home)
        }}
        completeText={submitText[wizardType]}>
        <Review {...formValue} />
      </FormCard>
    )
  }
  
  return (
    <YStack f={1} jc="center" ai="center" p="$4">
      <YStack space="$4" maw={600}>
        {content}
      </YStack>
    </YStack>
  )
}