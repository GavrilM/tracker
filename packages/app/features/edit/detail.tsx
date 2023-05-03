import { useEffect, useState } from 'react'
import { H1, ScrollView, Spinner, TextInput, YStack } from "@my/ui";
import { useSingleMetric } from "app/hooks";
import { createParam } from "solito";
import { AddMetricFlow } from "../wizard/AddMetricFlow";
import { isEqual, pick } from "lodash"

const { useParam } = createParam()

export function EditDetail() {
  const [id] = useParam('id')
  const {loading, data} = useSingleMetric(id || '')
  
  let [formValue, setFormValue] = useState(data)
  const [errMsg, setErrMsg] = useState('')
  const [errField, setErrField] = useState('')

  if (loading || !id) {
    return <Spinner />
  }
  formValue = Object.assign({}, data)

  const formFields = AddMetricFlow.map(({field, forwardProps, FormComponent, validate}, i) => {
    const handleChange = v => {
      const errStr = validate(v)
      if(errStr) {
        setErrMsg(errStr)
        setErrField(field)
      } else {
        setFormValue(Object.assign(formValue, {[field]: v}))
        setErrMsg('')
        setErrField('')
      }
    }

    return <FormComponent key={i}
      onChange={handleChange} defaultValue={formValue[field]}
      errorMessage={field === errField ? errMsg : undefined}
      forwardProps={forwardProps ? pick(formValue, forwardProps) : undefined}/>
  })

  return (
    <ScrollView f={1} ai="center" p="$4" space>
      {formFields}
    </ScrollView>
  )
}