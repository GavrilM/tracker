import { BinaryInput, MetricType, MonthDateInput, SelectInput, SizableText, WeekdayInput, XStack, YStack } from "@my/ui"
import { useEffect, useState } from "react"
import { doesReset, getPeriod, isAggregate, isTimeBounded } from "./utils"

export const MetricViewForm = ({ onChange, defaultValue }) => {
  const tips = {
    [MetricType.average]: 'One summary number',
    [MetricType.graph]: 'See changes over time',
    [MetricType.lastvalue]: 'A number to beat',
    [MetricType.streak]: 'Don\'t break the chain',
    [MetricType.total]: 'Add it all up'
  }
  
  const [type, setType] = useState(defaultValue?.type || MetricType.graph)
  const [weekday, setWeekday] = useState(defaultValue?.weekday)
  const [weekdays, setWeekdays] = useState(defaultValue?.weekdays)
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
      weekdays,
      month_date
    }, {[field]: value}))
  }
  const handleReset = v => {
    if(v) {
      setReset(true)
    } else {
      setReset(false)
      setWeekday(undefined)
      setWeekdays(undefined)
      setMonthDate(undefined)
      onChange({type, base_unit})
    }
  }

  useEffect(() => onChange({type, base_unit, weekday, weekdays, month_date}), [])

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

      {type === MetricType.streak && base_unit === 1 &&
        <YStack mt={16}>
          <BinaryInput defaultValue={reset ? 1 : 0} onChange={handleReset} yesLabel="Only on"
            noLabel="Every day" />
          {reset &&
            <WeekdayInput label="weekdays" values={weekdays} multiple
              onChange={handleChange('weekdays', setWeekdays)} />
          }
        </YStack>
      }
    </YStack>
  )
}