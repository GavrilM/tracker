import {
  CellCategories,
  MetricType,
  SelectInput,
  SizableText,
  TextInput,
  Weekday,
  YStack
} from "@my/ui";
import { WizardFlow } from "./WizardTypes";
import { MetricViewForm } from "app/components/form/MetricViewForm";
import { getPeriod } from "app/components/form/utils";
import { MetricQuestionFreqForm } from "app/components/form/MetricQuestionFreqForm";
import { MetricLimitForm } from "app/components/form/MetricLimitForm";
import { MetricTargetForm } from "app/components/form/MetricTargetForm";

export const AddMetricFlow: WizardFlow = [
  {
    field: 'name',
    title: 'What will we call this Metric?',
    subtitle: 'Pick something short and informative',
    validate: value => value?.length ? null : "Name is required",
    FormComponent: props => (
      <TextInput {...props} placeholder="Metric name"/>
    )
  },
  {
    field: 'view',
    title: 'What kind of Metric?',
    subtitle: 'You can always change it later',
    autofill: (view) => {
      const obj = {}
      if(view.type === MetricType.streak) {
        if(view.weekdays)
          obj['question_freq'] = {weekdays: view.weekdays}
        obj['limits'] = undefined
        obj['units'] = undefined
      }
      return obj
    },
    validate: () => null,
    FormComponent: MetricViewForm,
  },
  {
    field: 'units',
    title: 'What unit of measure?',
    subtitle: 'Optional',
    validate: () => null,
    FormComponent: props => (
      <TextInput {...props} placeholder="Unit"/>
    )
  },
  {
    field: 'question',
    title: 'What\'s the right question to ask?',
    subtitle: 'Choose a good question that forces you to think about this Metric correctly',
    validate: stepValue => stepValue?.length ? null : "Question is required",
    FormComponent: props => {
      const handleChange = v => props.onChange(v.charAt(v.length-1) !== '?' ? `${v}?` : v)
      return (
        <TextInput {...props} onChange={handleChange} placeholder="Question"/>
      )
    }
  },
  {
    field: 'question_freq',
    title: 'How often should ask yourself this question?',
    subtitle: 'This is how frequently you collect data for this Metric',
    validate: value => {
      if(!value || (!value.month_date && !value.weekdays && !value.days))
        return "Please choose a frequency"
      return null
    },
    FormComponent: MetricQuestionFreqForm
  },
  {
    field: 'limits',
    title: 'What are the minimum and maximum values?',
    subtitle: 'Optional',
    validate: value => {
      if(value && value.min !=undefined && value.max != undefined
         && value.min >= value.max)
        return "Min must be less than max"
      return null
    },
    FormComponent: MetricLimitForm
  },
  {
    field: 'target',
    title: 'What value should you target?',
    subtitle: 'You define what success looks like; optional',
    forwardProps: ['limits', 'units', 'view', 'question'],
    validate: () => null,
    FormComponent: MetricTargetForm
  },
  {
    field: 'category',
    title: 'What category does this Metric fall under?',
    subtitle: 'optional',
    validate: stepValue => null,
    FormComponent: ({ defaultValue, onChange}) => {
      const handleChange = v => onChange(`_${v}`)
      return (
        <SelectInput placeholder="Pick a category" value={defaultValue?.substring(1)}
          onChange={handleChange} width={200}
          values={Object.values(CellCategories).map(c => c.substring(1))}/>
      )
    }
  },
]

export function AddMetricReview(props) {
  let freqStr = props.question_freq.days === 1 ? 'every day' : `every ${props.question_freq.days} days`
  if(props.question_freq.weekdays) {
    freqStr = `on ${props.question_freq.weekdays.map(w => Weekday[w]).join("s, ")}s`
  } else if(props.question_freq.monthDate) {
    freqStr = props.question_freq.monthDate !== 'last day'
      ? `on the ${props.question_freq.monthDate}`
      : 'on the last day of the month'
  }
  let unitStr = props.units ? props.units : '(unitless)'
  let targetStr = `Your target is to achieve ${props.target?.direction} ${props.target?.value} ${unitStr}.`
  if(props.view.type === MetricType.streak)
    targetStr = `Your target is to answer ${props.target ? 'yes': 'no'}`
  const [_, periodStrings] = getPeriod(props.view)

  return (
    <YStack>
      <SizableText>{props.name}:
        {props.view.type !== MetricType.lastvalue ? ` ${periodStrings[props.view.base_unit]} `: ' '}
        {props.view.type}</SizableText> 
      <SizableText>Measure this {freqStr} by asking</SizableText>
      <SizableText>{props.question}</SizableText>
      {props.limits?.min != undefined && 
        <SizableText>At least {props.limits.min} 
          {props.limits.min_label && ` (${props.limits.min_label})`}</SizableText>
      }
      {props.limits?.max  != undefined && 
        <SizableText>At most {props.limits.max}
          {props.limits.max_label && ` (${props.limits.max_label})`}</SizableText>
      }
      {props.target != undefined
        ? <SizableText>{targetStr}</SizableText>
        : <SizableText>Measured in {unitStr}</SizableText>
      }
      {
        props.category && 
          <SizableText>Category: {props.category.substring(1)}</SizableText>
      }
    </YStack>
  )
}
