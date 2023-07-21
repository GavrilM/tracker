import { FormButton, FormCard, H2, ScrollView, Sheet, Spinner, XStack, DangerDialog } from "@my/ui"
import { useEffect, useState } from "react"
import { pick } from "lodash"
import { useDeleteMetric, useEditMetric } from 'app/hooks';
import { AddMetricFlow } from "../../features/wizard/AddMetricFlow";
import { Trash, XCircle } from "@tamagui/lucide-icons";
import { Metric } from "app/hooks/types/Metric";

type EditSheetProps = {
  isOpen: boolean,
  onClose: () => void,
  metric?: Metric
}

const formTitles = [
  'Name',
  'Display Type',
  'Units',
  'Question',
  'Ask Frequency',
  'Limits',
  'Target Value',
]

export function EditSheet({ isOpen, onClose, metric }: EditSheetProps) {
  const [mutation] = useEditMetric(metric?._id || '')
  const [deleteMetric] = useDeleteMetric()
  
  let [formValue, setFormValue] = useState<any>()
  const [errMsg, setErrMsg] = useState('')
  const [errField, setErrField] = useState('')
  
  useEffect(() => {
    const value: any = Object.assign({}, metric)
    delete value.last_point
    delete value.points_default
    setFormValue(value)
  }, [metric])

  if (!metric) {
    return <></>
  }

  const save = () => {
    mutation(formValue)
    onClose()
  }

  const remove = () => {
    deleteMetric({
      variables: {
        id: metric._id
      }
    })
    onClose()
  }

  const formFields = AddMetricFlow.map(({field, forwardProps, FormComponent, validate}, i) => {
    const handleChange = v => {
      const errStr = validate(v)
      if(errStr) {
        setErrMsg(errStr)
        setErrField(field)
      } else {
        const newValue = Object.assign(formValue, {[field]: v})
        if(field === 'view' && v.weekdays) {
          newValue['question_freq'] = {weekdays: v.weekdays}
        }
        setFormValue(newValue)
        setErrMsg('')
        setErrField('')
      }
    }

    return (
      <FormCard key={i} title={formTitles[i] || ''} height='100%' center>
        <FormComponent
          onChange={handleChange} defaultValue={formValue[field]}
          errorMessage={field === errField ? errMsg : undefined}
          forwardProps={forwardProps ? pick(formValue, forwardProps) : undefined}/>
      </FormCard>
    )
  })

  return (
    <Sheet modal open={isOpen} snapPoints={[90, 40]}
      onOpenChange={o => o ? null : onClose()}
      dismissOnSnapToBottom
      zIndex={100_000}
      animationConfig={{
        type: 'spring',
        damping: 40,
        stiffness: 450,
      }}>
      <Sheet.Overlay bc='white'/>
      <Sheet.Handle />
      <Sheet.Frame>
        <XStack jc="space-between" ac="center" pl={20}>
          <H2 mt={16}>Editing: {metric.name}</H2>
          <XStack jc="flex-end" p="$4" space>
            <FormButton onPress={onClose} type="secondary" icon={XCircle}>Exit without saving</FormButton>
            <FormButton onPress={save} type="primary">Save Changes</FormButton>
          </XStack>
        </XStack>
        
        <ScrollView f={1} ai="center" p="$4" space>
          {formFields}
          <DangerDialog title={`Delete ${metric.name}?`} subtitle="All data will be lost"
            onConfirm={remove}
            trigger={<FormButton type="danger" icon={Trash}>Delete</FormButton>}/>
        </ScrollView>
      </Sheet.Frame>
    </Sheet>
  )
}