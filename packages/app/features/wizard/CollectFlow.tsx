import { BinaryInput, ExpandibleSection, MetricType, NumberInput, SizableText, Spinner, TextArea, XStack, YStack } from "@my/ui";
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
          setText(v)
          if(value != undefined) {
            note['text'] = v
            obj['note'] = v.length ? note : undefined
            onChange(obj)
          } else {
            onChange(undefined)
          }
        }        
        else {
          setValue(undefined)
          onChange(undefined)
        }
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

const ReviewItem = ({name, value}) => (
  <XStack mt={8} f={1} jc="space-between" bbc="rgba(255,255,255,.2)" bbw={1}>
    <SizableText fow='700'>{name}</SizableText>
    <SizableText>{value}</SizableText>
  </XStack>
)

export function CollectReview(props) {  
  const {loading, data} = useCollectReview(props)

  if(loading)
    return <Spinner />
  const {targetsMet, targetsMissed, streaksKept, streaksMissed} = data

  const missed = targetsMissed.map(([n, v]) => <ReviewItem name={n} value={v}/>)
  streaksMissed.forEach(s => missed.push(<ReviewItem name={s} value={'streak lost'}/>))
  const met = targetsMet.map(([n, v]) => <ReviewItem name={n} value={v}/>)
  streaksKept.forEach(s => met.push(<ReviewItem name={s} value={'streak kept'}/>))
  return (
    <YStack f={1} width='100%'>
      <SizableText fos={16} col='#E43F3F'>{missed.length} Targets missed</SizableText>
      <YStack ml={20}>{missed}</YStack>
      <SizableText mt={20} fos={16} col='#53C041'>{met.length} Targets met</SizableText>
      <YStack ml={20}>{met}</YStack>
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
