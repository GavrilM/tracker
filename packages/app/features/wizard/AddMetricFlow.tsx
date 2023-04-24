import { Label, MetricType, NumberInput, SelectInput, SizableText, TextInput, ToggleGroup, XStack, YStack } from "@my/ui";
import { WizardFlow } from "./WizardTypes";
import { range } from "lodash"
import { useEffect, useState } from "react";

const weekdayOptions = {
  'sun': 'Sundays', 
  'mon': "Mondays",
  'tue': "Tuesdays",
  'wed': "Wednesdays",
  'thu': "Thursdays",
  'fri': "Fridays",
  'sat': "Saturdays"
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
    FormComponent: ({ onChange, defaultValue }) => {
      const tips = {
        [MetricType.average]: 'One summary number',
        [MetricType.graph]: 'See changes over time',
        [MetricType.lastvalue]: 'A number to beat',
        [MetricType.streak]: 'Don\'t break the chain',
        [MetricType.total]: 'The sum over a time period'
      }
      const periods = {
        '1 day': 1,
        '7 day': 7,
        '30 day': 30
      }
      const showUnit = t => t !== MetricType.lastvalue

      const [type, setType] = useState(defaultValue?.type || MetricType.average)
      const [unit, setBaseUnit] = useState(defaultValue ? `${defaultValue?.base_unit} day` : '1 day')
      const handleUnitChange = value => {
        setBaseUnit(value)
        onChange({ type, base_unit: periods[value] })
      }
      const handleTypeChange = value => {
        setType(value)
        onChange({ type: value, base_unit: showUnit(value) ? periods[unit] : 1 })
      }

      useEffect(() => onChange({type, base_unit: periods[unit]}), [])

      return (
        <YStack>
          <XStack space>
            {showUnit(type) && <SelectInput onChange={handleUnitChange} placeholder="Period"
              values={['1 day', '7 day', '30 day']} value={unit} width={120}/>}
            <SelectInput onChange={handleTypeChange} placeholder="Metric type"
              values={Object.values(MetricType)} value={type} width={160}/>
          </XStack>
          <SizableText ml={showUnit(type) ? 156 : 18} mt={4}>{tips[type]}</SizableText>
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
      const [weekdays, setWeekdays] = useState(defaultValue?.weekdays || ['sun'])
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
              <XStack>
                <Label mr={24}>on</Label>
                <ToggleGroup type='multiple' value={weekdays} onValueChange={handleChange(setWeekdays, 'weekdays')}>
                  {Object.keys(weekdayOptions).map((v,i) => (
                    <ToggleGroup.Item value={v} key={i}>
                      <SizableText>{v}</SizableText>
                    </ToggleGroup.Item>
                  ))}
                </ToggleGroup>
              </XStack>
            }
            {mode === 'month' &&
            <XStack space ai='center' jc='center'>
                <YStack height={60} jc="center">
                  <SizableText fow='700'>on the</SizableText>
                </YStack>
                <SelectInput placeholder="date" width={120} value={month_date}
                  values={range(1,32).map(ordinalSuffix).concat(['last day'])} onChange={handleChange(setMonthDate, 'month_date')}/>
              </XStack>
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
          minLabel,
          max,
          maxLabel
        }, { [field]: v }))
      }
      const [min, setMin] = useState(defaultValue?.min)
      const [minLabel, setMinLabel] = useState(defaultValue?.minLabel)
      const [max, setMax] = useState(defaultValue?.max)
      const [maxLabel, setMaxLabel] = useState(defaultValue?.maxLabel)

      return (
        <YStack ai='center'>
          <Label jc="center">On the scale of:</Label>
          <XStack>
            <NumberInput defaultValue={min} onChange={handleChange(setMin, 'min')} autofocus />
            <YStack height={70} jc="center" px={16}><SizableText fow='700'>to</SizableText></YStack>
            <NumberInput defaultValue={max} onChange={handleChange(setMax, 'max')}/>
          </XStack>
          <XStack space f={1}>
            <TextInput defaultValue={minLabel} placeholder="Min Label" 
              onChange={handleChange(setMinLabel, 'minLabel')} width={200}/>
            <TextInput defaultValue={maxLabel} placeholder="Max Label"
              onChange={handleChange(setMaxLabel, 'maxLabel')} width={200}/>
          </XStack>
        </YStack>
      )
    }
  },
  {
    field: 'target_value',
    title: 'Do you have an amount you want to target?',
    subtitle: 'Also optional, but you should poop once a day',
    forwardProps: ['limits', 'units'],
    FormComponent: props => {
      return (
      <NumberInput {...props} {...props.forwardProps.limits} units={props.forwardProps.units} autofocus/>
    )}
  },
]

export function AddMetricReview(props) {
  let freqStr = props.question_freq.days === 1 ? 'every day' : `every ${props.question_freq.days} days`
  if(props.question_freq.weekdays) {
    freqStr = `on ${props.question_freq.weekdays.map(w => weekdayOptions[w]).join(", ")}`
  } else if(props.question_freq.monthDate) {
    freqStr = props.question_freq.monthDate !== 'last day'
      ? `on the ${props.question_freq.monthDate}`
      : 'on the last day of the month'
  }
  return (
    <YStack>
      <SizableText>{props.name}:
        {props.view.type !== MetricType.lastvalue ? ` ${props.view.base_unit} day ` : ' '}
        {props.view.type}</SizableText> 
      <SizableText>Measure this {freqStr} by asking</SizableText>
      <SizableText>{props.question}</SizableText>
      {props.limits?.min != undefined && 
        <SizableText>At least {props.limits.min} ({props.limits.minLabel})</SizableText>
      }
      {props.limits?.max  != undefined && 
        <SizableText>At most {props.limits.max} ({props.limits.maxLabel})</SizableText>
      }
      {props.target_value != undefined
        ? <SizableText>You should achieve {props.target_value} {props.units}.</SizableText>
        : <SizableText>Measured in {props.units}</SizableText>
      }
    </YStack>
  )
}

function ordinalSuffix(i) {
  var j = i % 10,
      k = i % 100;
  if (j == 1 && k != 11) {
      return i + "st";
  }
  if (j == 2 && k != 12) {
      return i + "nd";
  }
  if (j == 3 && k != 13) {
      return i + "rd";
  }
  return i + "th";
}