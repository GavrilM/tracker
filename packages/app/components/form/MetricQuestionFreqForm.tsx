import { ErrorText, MonthDateInput, NumberInput, SelectInput, SizableText, WeekdayInput, XStack, YStack } from "@my/ui"
import { useEffect, useState } from "react"

export const MetricQuestionFreqForm = ({ onChange, defaultValue, errorMessage, autofocus }) => {
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
    if(mode === 'week')
      onChange({weekdays})
    else if(mode === 'month')
      onChange({month_date})
    else
      onChange({days})
  }, [mode])
  
  return (
    <YStack space>
      <XStack space ai='center' jc='center'>
        <YStack height={60} jc="center">
          <SizableText fow='700'>Every</SizableText>
        </YStack>
        {mode === 'day(s)' &&
          <NumberInput onChange={handleChange(setDays, 'days')} defaultValue={days} min={1} autofocus={autofocus}/>
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
      <ErrorText text={errorMessage}/>
    </YStack>
  )
}