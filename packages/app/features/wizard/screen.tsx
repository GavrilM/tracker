import { FormCard, YStack, H1, TextInput, H3 } from "@my/ui"
import { useState } from "react"
import { pick } from "lodash"
import { WizardFlow, WizardType } from "./WizardTypes"
import { AddMetricFlow, AddMetricReview } from "./AddMetricFlow"
import { useRealmApp } from "app/provider/realm"
import { useCreateMetric, useUserData } from "app/hooks"
import { useRouter } from "solito/router"
import { routes } from "app/navigation/web"

type WizardScreenProps = {
  wizardType: WizardType,
  wizardTypes?: Array<WizardType>,
  icons?: Array<React.ReactNode>
}

const wizards = {
  [WizardType.metric]: AddMetricFlow
}

const reviewComponents = {
  [WizardType.metric]: AddMetricReview
}

const useMutation = {
  [WizardType.metric]: useCreateMetric
}

const submitText = {
  [WizardType.metric]: "Create Cell"
}

export const WizardScreen = ({ wizardType }: WizardScreenProps) => {
  const app = useRealmApp()
  const {loading, userData} = useUserData()
  console.log(userData)
  const { replace } = useRouter()

  const [mutationFn] = useMutation[wizardType]()
  const [stepNum, setStepNum] = useState(0)
  let [stepValue, setStepValue] = useState<any>()
  const [formValue, setFormValue] = useState({})
  const steps: WizardFlow = wizards[wizardType]

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
          mutationFn({variables: {
            data: Object.assign(formValue, {owner_id: {link: userData.user_id}}) 
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