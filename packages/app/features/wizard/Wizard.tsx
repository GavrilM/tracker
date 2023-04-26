import React, { useState } from "react"
import { WizardFlow } from "./WizardTypes"
import { FormCard, H1, H3 } from "@my/ui"
import { pick } from "lodash"
import { useUserId } from "app/hooks"
import { useRouter } from "solito/router"
import { routes } from "app/navigation/web"

type WizardProps = {
  steps: WizardFlow
  onStep?: (Object) => void,
  onComplete: (Object) => void,
  Review: () => React.ReactElement,
  submitButtonText: string
}

export function Wizard({ steps, onStep, onComplete, Review, submitButtonText }: WizardProps) {
  const userId = useUserId()
  const withOwnerId = o => Object.assign({owner_id: {link: userId}}, o)
  const { replace } = useRouter()
  
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
    const { field, title, subtitle, forwardProps, FormComponent, buildQuery } = steps[stepNum]

    let props = forwardProps ? pick(formValue, forwardProps) : {}

    const handleContinue = () => {
      setFormValue(Object.assign(formValue, {[field]: stepValue}))
      setStepNum(stepNum + 1)
      setStepValue(formValue[steps[stepNum + 1]?.field])
      if(stepValue && onStep)
        onStep({variables: {
          query: buildQuery ? buildQuery(stepValue) : undefined,
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
    content = (
      <FormCard
        title={'Review'}
        onBack={backFn(false)}
        onComplete={() => {
          onComplete({variables: {
            data: withOwnerId(formValue) 
          }})
          replace(routes.home)
        }}
        completeText={submitButtonText}>
        <Review {...formValue} />
      </FormCard>
    )
  }

  return content
}
