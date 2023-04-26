import { ExpandibleSection, NumberInput, Spinner, YStack } from "@my/ui";
import { WizardFlow } from "./WizardTypes";
import { Metric } from "app/hooks/types/Metric";
import { useCollectReview } from "app/hooks";
import { useContext } from "react";
import { CollectDateContext } from "./Contexts";

export function CollectFlow(metrics: Array<Metric>): WizardFlow {
  return metrics.map(({_id, question, limits, units}) => ({
    field: _id,
    title: question,
    subtitle: '',
    buildQuery: d => ({metric_id: {_id: d.metric_id.link}, timestamp: d.timestamp}),
    FormComponent: ({ onChange, defaultValue }) => {
      const date = useContext(CollectDateContext)
      const handleChange = value => {
        onChange({
          metric_id: {link: _id},
          timestamp: date,
          value,
        })
      }
      return (
        <NumberInput autofocus onChange={handleChange} units={units} defaultValue={defaultValue?.value}
          min={limits?.min} minLabel={limits?.min_label} max={limits?.max} maxLabel={limits?.max_label}/>
      )
    }
  }))
} 

export function CollectReview() {
  const {loading, data} = useCollectReview()

  if(loading)
    return <Spinner />
  const {targetsMet, targetsMissed} = data

  return (
    <YStack>
      <ExpandibleSection type="good" items={targetsMet}
        title={`${targetsMet.length} targets met`}/>
      <ExpandibleSection type="bad" items={targetsMissed}
        title={`${targetsMissed.length} targets missed`}/>
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
