import { FormCard, YStack, H1, H3, Spinner } from "@my/ui"
import { WizardFlow, WizardType } from "./WizardTypes"
import { AddMetricFlow, AddMetricReview } from "./AddMetricFlow"
import { useCollectPoints, useCollectQuestions, useCreateMetric } from "app/hooks"
import { CollectFlow, CollectReview } from "./CollectFlow"
import { Wizard } from "./Wizard"
import { Metric } from "app/hooks/types/Metric"
import moment from "moment"
import { CollectDateContext } from "./Contexts"

type WizardScreenProps = {
  wizardType: WizardType,
  wizardTypes?: Array<WizardType>,
  icons?: Array<React.ReactNode>
}

const dummyMutation = () => [() => {}]

const wizards = {
  [WizardType.metric]: () => AddMetricFlow,
  [WizardType.collect]: metrics => CollectFlow(metrics)
}

const reviewComponents = {
  [WizardType.metric]: AddMetricReview,
  [WizardType.collect]: CollectReview,
}

const useCompleteMutation = {
  [WizardType.metric]: useCreateMetric,
  [WizardType.collect]: useCollectPoints,
}

const useStepMutation = {
  [WizardType.metric]: dummyMutation,
  [WizardType.collect]: dummyMutation
}

const submitText = {
  [WizardType.metric]: "Create Cell",
  [WizardType.collect]: "Save and Exit"
}

const getCurrentDate = () => moment(moment().format('YYYYMMDD')).toISOString()

export const WizardScreen = ({ wizardType }: WizardScreenProps) => {
  let data: Array<Metric> = [],
    loading = true,
    date = getCurrentDate()
  if(wizardType === WizardType.collect) {
    const result = useCollectQuestions(date)
    loading = result.loading
    data = result.data || []
  } else {
    loading = false
  }
  
  const [completeFn] = useCompleteMutation[wizardType]()
  const [stepFn] = useStepMutation[wizardType]()
  const steps: WizardFlow = wizards[wizardType](data)

  let content = <Spinner />
  if(!loading)
    content = (
      <Wizard steps={steps} onStep={stepFn} onComplete={completeFn} requireValue={wizardType === WizardType.collect}
          Review={reviewComponents[wizardType]} submitButtonText={submitText[wizardType]}/>
    )
  
  return (
    <YStack f={1} jc="center" ai="center" p="$4">
      <YStack space="$4" maw={600}>
        <CollectDateContext.Provider value={date}>
          {content}
        </CollectDateContext.Provider>
      </YStack>
    </YStack>
  )
}