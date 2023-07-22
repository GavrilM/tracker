import { useEffect, useState } from 'react'
import { FormCard, ScrollView, Spinner } from "@my/ui";
import { useSingleMetric } from "app/hooks";
import { createParam } from "solito";
import { AddMetricFlow } from "../wizard/AddMetricFlow";
import { pick } from "lodash"
import { useSetNavTitle } from 'app/provider/context/NavTitleContext';
import { useSetNavAction } from 'app/provider/context/NavActionContext';
import { useRouter } from 'solito/router';
import { useEditMetric } from 'app/hooks';

const { useParam } = createParam()

const formTitles = [
  'Name',
  'Display Type',
  'Unit',
  'Question',
  'Ask Frequency',
  'Limits',
  'Target Value',
]

export function EditDetail() {
  const [id] = useParam('id')
  const setTitle = useSetNavTitle()
  const setNavAction = useSetNavAction()
  const { back } = useRouter()

  const {loading, data} = useSingleMetric(id || '')
  const [mutation] = useEditMetric(id || '')
  
  let [formValue, setFormValue] = useState<any>()
  const [errMsg, setErrMsg] = useState('')
  const [errField, setErrField] = useState('')
  
  useEffect(() => {
    setFormValue(Object.assign({}, data))
    if(data?.name) {
      setTitle(data.name)
    }
    setNavAction({
      save: back,
      close: back
    })
  }, [data])

  if (loading || !id || !formValue?.name) {
    return <Spinner />
  }

  const formFields = AddMetricFlow.map(({field, forwardProps, FormComponent, validate}, i) => {
    const handleChange = v => {
      const errStr = validate(v)
      if(errStr) {
        setErrMsg(errStr)
        setErrField(field)
        setNavAction({
          save: null
        })
      } else {
        const newValue = Object.assign(formValue, {[field]: v})
        if(field === 'view' && v.weekdays) {
          newValue['question_freq'] = {weekdays: v.weekdays}
        }
        setFormValue(newValue)
        setErrMsg('')
        setErrField('')
        setTitle(newValue.name)
        setNavAction({
          save: () => {
            mutation(newValue)
            back()
          }
        })
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
    <ScrollView f={1} ai="center" p="$4" space>
      {formFields}
    </ScrollView>
  )
}