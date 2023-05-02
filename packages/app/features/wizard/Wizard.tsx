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
  submitButtonText: string,
}

export function Wizard({ steps, onStep, onComplete, Review, submitButtonText }: WizardProps) {
  const userId = useUserId()
  const { replace } = useRouter()
  
  const [stepNum, setStepNum] = useState(0)
  let [stepValue, setStepValue] = useState<any>()
  const [formValue, setFormValue] = useState({})
  const [autofilled, setAutofilled] = useState({})
  const [errMsg, setErrMsg] = useState<string | undefined>()
  console.log(formValue, autofilled)

  const getNextStepNum = (direction) => {
    const skipFields = new Set()
    Object.values(autofilled).forEach((f: Object) => {
      Object.keys(f).forEach(k => skipFields.add(k))
    })
    let nextStep = stepNum + direction
    while (nextStep < steps.length && skipFields.has(steps[nextStep].field))
      nextStep += direction
    return nextStep
  }

  const backFn = field => () => {
    const nextStepNum = getNextStepNum(-1)
    if(field)
      setFormValue(Object.assign(formValue, {[field]: stepValue}))
    setStepValue(formValue[steps[nextStepNum].field])
    setStepNum(nextStepNum)
    setErrMsg(undefined)
  }
  let content = <H3>Complete!</H3>

  if(stepNum < steps.length) {
    const { field, title, subtitle, forwardProps, validate,
      FormComponent, buildQuery, autofill, skippable } = steps[stepNum]

    let props = forwardProps ? pick(formValue, forwardProps) : {}

    const handleSkip = () => {
      stepValue = undefined
      handleContinue()
    }
    const handleContinue = () => {
      const error = validate(stepValue)
      if(error) {
        setErrMsg(error)
        setStepValue(stepValue)
        return
      } else {
        setErrMsg(undefined)
      }
      
      if(autofill)
        setAutofilled(Object.assign(autofilled, {[field]: autofill(stepValue)}))
      const nextStepNum = getNextStepNum(1)
      setFormValue(Object.assign(formValue, {[field]: stepValue}))
      setStepNum(nextStepNum)
      setStepValue(formValue[steps[nextStepNum]?.field])
      if(stepValue && onStep)
        onStep({variables: {
          query: buildQuery ? buildQuery(stepValue) : undefined,
          data: stepValue
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
          onSkip={skippable ? handleSkip : undefined}
          onContinue={handleContinue}
          height={450}>
          <FormComponent onChange={v => {stepValue = v}} errorMessage={errMsg}
            defaultValue={stepValue} forwardProps={props}/>
        </FormCard>
      </>
    )
  } else if (stepNum === steps.length) {
    Object.values(autofilled).forEach(a => {
      Object.assign(formValue, a)
    })
    content = (
      <FormCard
        title={'Review'}
        onBack={steps.length ? backFn(false) : undefined}
        onComplete={() => {
          onComplete(formValue)
          replace(routes.home)
        }}
        completeText={submitButtonText}>
        <Review {...formValue} />
      </FormCard>
    )
  }

  return content
}
