import { NumberInput, XStack } from "@my/ui";
import { WizardFlow } from "./WizardTypes";
import { Metric } from "app/hooks/types/Metric";

export function CollectFlow(metrics: Array<Metric>): WizardFlow {
  return metrics.map(({_id, question, limits, units}) => ({
    field: _id,
    title: question,
    subtitle: '',
    upsertFields: ['metric_id', 'timestamp'],
    FormComponent: ({ onChange, defaultValue, date }) => {
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
  return <XStack />
}
// missed targets
// missed goals
// completed goals
// met/exceeded targets
// goals in progress
// streaks kept/lost
// 
