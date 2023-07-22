import React, { useEffect, useRef, useState } from "react"
import { WizardFlow } from "./WizardTypes"
import { FormCard, H1, H3 } from "@my/ui"
import { pick } from "lodash"
import { useUserId } from "app/hooks"
import { useRouter } from "solito/router"
import { routes } from "app/navigation/web"
import { useSetNavAction } from "app/provider/context/NavActionContext"
import { EventEmitter } from "events"

type WizardProps = {
  steps: WizardFlow
  onStep?: (Object) => void,
  onComplete: (Object) => void,
  Review: () => React.ReactElement,
  submitButtonText: string,
  requireValue: boolean,
}

export function Wizard({ steps, onStep, onComplete, Review, submitButtonText, requireValue }: WizardProps) {
  const userId = useUserId()
  const { replace, back } = useRouter()
  const saveEvents = useRef(new EventEmitter()).current
  const setNavAction = useSetNavAction()
  
  const [stepNum, setStepNum] = useState(0)
  let [stepValue, setStepValue] = useState<any>()
  let [stepField, setStepField] = useState('')
  const [formValue, setFormValue] = useState({})
  const [autofilled, setAutofilled] = useState({})
  const [errMsg, setErrMsg] = useState<string | undefined>()
  console.log(formValue, autofilled)

  const saveFn = () => {
    saveEvents.emit('saveForm')
    back()
  }
  useEffect(() => {
    setNavAction({ close: back, save: saveFn })
  }, [])

  useEffect(() => {
    if(errMsg)
      setNavAction({ close: back, save: null })
    else
      setNavAction({ close: back, save: saveFn })
  }, [errMsg])

  saveEvents.removeAllListeners('saveForm')
  saveEvents.addListener('saveForm', () => {
    const saveValue = Object.assign(formValue, {[stepField]: stepValue})
    onComplete(saveValue)
    saveEvents.removeAllListeners('saveForm')
  })

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
    setStepField(field)
    setStepNum(nextStepNum)
    setErrMsg(undefined)
  }
  let content = <H3>Complete!</H3>

  if(stepNum < steps.length) {
    const { field, title, subtitle, forwardProps, validate,
      FormComponent, buildQuery, autofill, skippable } = steps[stepNum]

    let props = forwardProps ? pick(formValue, forwardProps) : {}
    stepField = field

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
      const nextField = steps[nextStepNum]?.field
      setStepValue(formValue[nextField])
      setStepField(nextField)
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
          disableContinue={requireValue && stepValue === undefined}
          height={480}>
          <FormComponent onChange={v => setStepValue(v)} errorMessage={errMsg}
            defaultValue={stepValue} forwardProps={props} autofocus/>
        </FormCard>
      </>
    )
  } else if (stepNum === steps.length) {
    Object.values(autofilled).forEach(a => {
      Object.assign(formValue, a)
    })
    const numPoints = Object.values(formValue)
      .filter(p => p != undefined).length
    content = (
    <>
      <H1 ta="center" opacity={0}>Step</H1>
      <FormCard
        title={`${numPoints} points collected`}
        onBack={steps.length ? backFn(false) : undefined}
        onComplete={() => {
          onComplete(formValue)
          setStepNum(0)
          setStepValue(undefined)
          setStepField('')
          setFormValue({})
          setAutofilled({})
          replace(routes.home)
        }}
        completeText={submitButtonText}
        height={480}>
        <Review {...formValue} />
      </FormCard>
    </>
    )
  }

  return content
}
