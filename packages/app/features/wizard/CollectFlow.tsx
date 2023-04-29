import { BinaryInput, ExpandibleSection, MetricType, NumberInput, SizableText, Spinner, YStack } from "@my/ui";
import { WizardFlow } from "./WizardTypes";
import { Metric } from "app/hooks/types/Metric";
import { useCollectReview } from "app/hooks";
import { useContext } from "react";
import { CollectDateContext } from "./Contexts";

export function CollectFlow(metrics: Array<Metric>): WizardFlow {
  return metrics.map(({_id, question, limits, units, view}) => ({
    field: _id,
    title: question,
    subtitle: '',
    buildQuery: d => ({metric_id: {_id: d.metric_id.link}, timestamp: d.timestamp}),
    skippable: true,
    validate: value => {
      if(value == undefined)
        return null
      if(view.type !== MetricType.streak) {
        if(limits.min != undefined && value.value < limits.min)
          return "Too small"
        else if(limits.max != undefined && value.value > limits.max)
          return "Too large"
      }
      return null
    },
    FormComponent: ({ onChange, defaultValue, errorMessage }) => {
      const date = useContext(CollectDateContext)
      const handleChange = value => {
        if(value != undefined)
          onChange({
            metric_id: {link: _id},
            timestamp: date,
            value,
          })
        else
          onChange(undefined)
      }

      if(view.type === MetricType.streak)
        return <BinaryInput defaultValue={defaultValue?.value} 
          onChange={handleChange} errorMessage={errorMessage}/>

      return (
        <NumberInput autofocus nodefault units={units}
          onChange={handleChange} defaultValue={defaultValue?.value}  errorMessage={errorMessage}
          min={limits?.min} minLabel={limits?.min_label} max={limits?.max} maxLabel={limits?.max_label}/>
      )
    }
  }))
} 

export function CollectReview(props) {  
  const {loading, data} = useCollectReview(props)

  if(loading)
    return <Spinner />
  const {targetsMet, targetsMissed, streaksKept, streaksMissed, total} = data

  return (
    <YStack>
      <SizableText>Points collected: {total}</SizableText>
      <ExpandibleSection type="good" items={targetsMet}
        title={`${targetsMet.length} targets met`}/>
      <ExpandibleSection type="good" items={streaksKept}
        title={`${streaksKept.length} streaks kept`}/>
      <ExpandibleSection type="bad" items={targetsMissed}
        title={`${targetsMissed.length} targets missed`}/>
      <ExpandibleSection type="bad" items={streaksMissed}
        title={`${streaksMissed.length} streaks lost`}/>
    </YStack>
  )
}
// missed targets
// missed goals
// completed goals
// met/exceeded targets
// goals in progress
// streaks kept/lost
// 
