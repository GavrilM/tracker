import {
  BinaryInput,
  Label,
  MetricType,
  MonthDateInput,
  NumberInput,
  RadioGroup, 
  SelectInput,
  SizableText,
  TextInput,
  Weekday, 
  WeekdayInput, 
  XStack,
  YStack
} from "@my/ui";
import { WizardFlow } from "./WizardTypes";
import { useEffect, useState } from "react";

const nPeriods = {
  'Overall': 0,
  '1 day': 1,
  '7 day': 7,
  '30 day': 30,
}
const lyPeriods = {
  'Overall': 0,
  'Daily': 1,
  'Weekly': 7,
  'Monthly': 30
}
const nPeriodStrings = {
  0: 'Overall',
  1: '1 day',
  7: '7 day',
  30: '30 day'
}
const lyPeriodStrings = {
  0: 'Overall',
  1: 'Daily',
  7: 'Weekly',
  30: 'Monthly'
}

const isAggregate = t => t === MetricType.total || t === MetricType.average || t === MetricType.graph
const isTimeBounded = t => t === MetricType.streak
const doesReset = v => v?.weekday != undefined || v?.month_date != undefined
function getPeriod(view) {
  const uselyPeriods = view?.type === MetricType.streak || (isAggregate(view?.type) && doesReset(view))
  const periods = uselyPeriods ? lyPeriods : nPeriods 
  const periodStrings = uselyPeriods ? lyPeriodStrings : nPeriodStrings
  return [periods, periodStrings]
}

export const AddMetricFlow: WizardFlow = [
  {
    field: 'name',
    title: 'What will we call this Metric?',
    subtitle: 'Pick something short and informative',
    FormComponent: props => (
      <TextInput {...props} placeholder="Metric name" autofocus/>
    )
  },
  {
    field: 'units',
    title: 'What unit of measure?',
    subtitle: '"Poops" instead of "number of poops"',
    FormComponent: props => (
      <TextInput {...props} placeholder="Unit" autofocus/>
    )
  },
  {
    field: 'view',
    title: 'What kind of Metric?',
    subtitle: 'You can always change it later',
    autofill: (view) => {
      if(view.type === MetricType.streak)
        return {limits: undefined}
      return {}
    },
    FormComponent: ({ onChange, defaultValue }) => {
      const tips = {
        [MetricType.average]: 'One summary number',
        [MetricType.graph]: 'See changes over time',
        [MetricType.lastvalue]: 'A number to beat',
        [MetricType.streak]: 'Don\'t break the chain',
        [MetricType.total]: 'Add it all up'
      }
      
      const [type, setType] = useState(defaultValue?.type || MetricType.graph)
      const [weekday, setWeekday] = useState(defaultValue?.weekday)
      const [month_date, setMonthDate] = useState(defaultValue?.month_date)
      const [reset, setReset] = useState(doesReset(defaultValue))

      const showUnit = v => v !== MetricType.lastvalue
      const [periods, periodStrings] = getPeriod({type, weekday, month_date})
      const periodOptions = isTimeBounded(type)
        ? Object.keys(periods).filter(ps => ps !== 'Overall')
        : isAggregate(type)
        ? Object.keys(periods).filter(ps => ps !== '1 day' && ps !== 'Daily')
        : Object.keys(periods)

      const [base_unit, setBaseUnit] = useState(
        defaultValue?.base_unit != undefined ? defaultValue.base_unit : 0)
    
      const handleChange = (field, fn) => value => {
        let tempBaseUnit = base_unit
        if(field === 'type' && isTimeBounded(value) && base_unit === 0) {
          tempBaseUnit = 1
          setBaseUnit(1)
        }
        if(field === 'type' && isAggregate(value) && base_unit === 1) {
          tempBaseUnit = 0
          setBaseUnit(0)
        }
        value = field === 'base_unit' ? periods[value]: value        
        fn(value)
        onChange(Object.assign({
          type,
          base_unit: tempBaseUnit,
          weekday,
          month_date
        }, {[field]: value}))
      }
      const handleReset = v => {
        if(v) {
          setReset(true)
        } else {
          setReset(false)
          setWeekday(undefined)
          setMonthDate(undefined)
          onChange({type, base_unit})
        }
      }

      useEffect(() => onChange({type, base_unit, weekday, month_date}), [])

      return (
        <YStack>
          <XStack space>
            {showUnit(type) && <SelectInput onChange={handleChange('base_unit', setBaseUnit)} placeholder="Period"
              values={periodOptions} value={periodStrings[base_unit]} width={120}/>}
            <SelectInput onChange={handleChange('type', setType)} placeholder="Metric type"
              values={Object.values(MetricType)} value={type} width={160}/>
          </XStack>
          <SizableText ml={showUnit(type) ? 156 : 18} mt={4}>{tips[type]}</SizableText>

          {isAggregate(type) && base_unit > 1 &&
            <YStack mt={16}>
              <BinaryInput defaultValue={reset ? 1 : 0} onChange={handleReset} yesLabel="Reset the count"
                noLabel={`Count the last ${base_unit === 7 ? ' 7 days' : ' 30 days'}`} />
            {reset && base_unit === 7 &&
              <WeekdayInput label="every" value={weekday} 
                onChange={handleChange('weekday', setWeekday)} />
            }
            {reset && base_unit === 30 &&
              <MonthDateInput label="every month on the" value={month_date}
                onChange={handleChange('month_date', setMonthDate)}/>
            }
            </YStack>
          }
        </YStack>
      )
    }
  },
  {
    field: 'question',
    title: 'What\'s the right question to ask?',
    subtitle: 'Choose a good question that forces you to think about this Metric correctly',
    FormComponent: props => {
      const handleChange = v => props.onChange(v.charAt(v.length-1) !== '?' ? `${v}?` : v)
      return (
        <TextInput {...props} onChange={handleChange} placeholder="Question" autofocus/>
      )
    }
  },
  {
    field: 'question_freq',
    title: 'How often should ask yourself this question?',
    subtitle: 'This is how frequently you collect data for this Metric',
    FormComponent: ({ onChange, defaultValue }) => {
      const handleChange = (fn, field) => v => {
        fn(v)
        onChange({ [field]: v })
      }
      const defaultMode = defaultValue?.monthDate ? 'month' : defaultValue?.weekdays ? 'week' : 'day(s)'
      const [mode, setMode] = useState(defaultMode)
      const [days, setDays] = useState(defaultValue?.days || 1)
      const [weekdays, setWeekdays] = useState(defaultValue?.weekdays || [0])
      const [month_date, setMonthDate] = useState(defaultValue?.month_date || '1st')
      
      useEffect(() => {
        if(!defaultValue) {
          if(mode === 'week')
            onChange({weekdays})
          else if(mode === 'month')
            onChange({month_date})
          onChange({days})
        }
      }, [mode])
      
      return (
        <YStack space>
          <XStack space ai='center' jc='center'>
            <YStack height={60} jc="center">
              <SizableText fow='700'>Every</SizableText>
            </YStack>
            {mode === 'day(s)' &&
              <NumberInput onChange={handleChange(setDays, 'days')} defaultValue={days} min={1} autofocus/>
            }
            <SelectInput placeholder="Period" width={100} value={mode}
              values={['day(s)', 'week', 'month']} onChange={setMode}/>
          </XStack>
            {mode === 'week' &&
              <WeekdayInput multiple label={'on'} 
                values={weekdays} onChange={handleChange(setWeekdays, 'weekdays')}/>
            }
            {mode === 'month' &&
              <MonthDateInput label={'on the'} 
                value={month_date} onChange={handleChange(setMonthDate, 'month_date')} />
            } 
        </YStack>
      )
    }
  },
  {
    field: 'limits',
    title: 'What are the minimum and maximum values?',
    subtitle: 'Optional',
    FormComponent: ({ defaultValue, onChange }) => {
      const handleChange = (fn, field) => v => {
        fn(v)
        onChange(Object.assign({
          min,
          min_label,
          max,
          max_label
        }, { [field]: v }))
      }
      const [min, setMin] = useState(defaultValue?.min)
      const [min_label, setMinLabel] = useState(defaultValue?.minLabel)
      const [max, setMax] = useState(defaultValue?.max)
      const [max_label, setMaxLabel] = useState(defaultValue?.maxLabel)

      return (
        <YStack ai='center'>
          <Label jc="center">On the scale of:</Label>
          <XStack>
            <NumberInput defaultValue={min} onChange={handleChange(setMin, 'min')} autofocus />
            <YStack height={70} jc="center" px={16}><SizableText fow='700'>to</SizableText></YStack>
            <NumberInput defaultValue={max} onChange={handleChange(setMax, 'max')}/>
          </XStack>
          <XStack space f={1}>
            <TextInput defaultValue={min_label} placeholder="Min Label" 
              onChange={handleChange(setMinLabel, 'min_label')} width={200}/>
            <TextInput defaultValue={max_label} placeholder="Max Label"
              onChange={handleChange(setMaxLabel, 'max_label')} width={200}/>
          </XStack>
        </YStack>
      )
    }
  },
  {
    field: 'target_value',
    title: 'What value should you target?',
    subtitle: 'You define what success looks like',
    forwardProps: ['limits', 'units', 'view', 'question'],
    FormComponent: props => {
      const {question, limits, units, view} = props.forwardProps

      let input = <NumberInput {...props} {...limits} units={units} autofocus/>
      if(view.type === MetricType.streak)
        input = <BinaryInput {...props} 
          defaultValue={props.defaultValue != undefined ? props.defaultValue : 1}/>

      return (
        <YStack>
          <SizableText fontStyle="italic">{question}</SizableText>
          {input}
        </YStack>
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
  let targetStr = `Your target is to achieve ${props.target_value} ${props.units}.`
  if(props.view.type === MetricType.streak)
    targetStr = `Your target is to answer ${props.target_value ? 'yes': 'no'}`
  const [_, periodStrings] = getPeriod(props.view)

  return (
    <YStack>
      <SizableText>{props.name}:
        {props.view.type !== MetricType.lastvalue ? ` ${periodStrings[props.view.base_unit]} `: ' '}
        {props.view.type}</SizableText> 
      <SizableText>Measure this {freqStr} by asking</SizableText>
      <SizableText>{props.question}</SizableText>
      {props.limits?.min != undefined && 
        <SizableText>At least {props.limits.min} ({props.limits.min_label})</SizableText>
      }
      {props.limits?.max  != undefined && 
        <SizableText>At most {props.limits.max} ({props.limits.max_label})</SizableText>
      }
      {props.target_value != undefined
        ? <SizableText>{targetStr}</SizableText>
        : <SizableText>Measured in {props.units ? props.units : '(unitless)'}</SizableText>
      }
    </YStack>
  )
}
