import { BinaryInput, ExpandibleSection, MetricType, NumberInput, SizableText, Spinner, TextArea, YStack } from "@my/ui";
import { WizardFlow } from "./WizardTypes";
import { Metric } from "app/hooks/types/Metric";
import { useCollectReview } from "app/hooks";
import { useContext, useMemo, useState } from "react";
import { CollectDateContext } from "./Contexts";
import { ObjectId } from "bson"

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
      if(view.type !== MetricType.streak && limits) {
        if(limits.min != undefined && value.value < limits.min)
          return "Too small"
        else if(limits.max != undefined && value.value > limits.max)
          return "Too large"
      }
      return null
    },
    FormComponent: ({ onChange, defaultValue, errorMessage }) => {
      const date = useContext(CollectDateContext)
      const [text, setText] = useState(defaultValue?.note?.text)
      const [value, setValue] = useState(defaultValue?.value)
      const point_id = useMemo(() => new ObjectId(), [])
      const handleChange = v => {
        const obj = {
          _id: point_id,
          metric_id: {link: _id},
          timestamp: date,
          value
        }
        const note = {
          timestamp: date,
          metric_id: {link: _id},
          point_id: {link: point_id},
          text
        } 
        obj['note'] = text ? note : undefined
        if(typeof v === 'number') {
          obj['value'] = v
          onChange(obj)
          setValue(v)
        } 
        else if (typeof v === 'string') {
          note['text'] = v
          obj['note'] = note
          onChange(obj)
          setText(v)
        }        
        else
          onChange(undefined)
      }

      let input = (
        <NumberInput autofocus nodefault units={units} {...limits}
          onChange={handleChange} defaultValue={value} errorMessage={errorMessage}/>
      )
      if(view.type === MetricType.streak)
        input = <BinaryInput defaultValue={value} 
          onChange={handleChange} errorMessage={errorMessage}/>

      return (
        <YStack f={1} ai='center' space>
          {input}
          <TextArea size="$5" placeholder="Add note..." 
            onChangeText={handleChange} defaultValue={text}/>
        </YStack>
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
