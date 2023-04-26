export enum WizardType {
  metric,
  goal,
  collect
}

type WizardStepFormProps = {
  onChange: (any) => void,
  defaultValue?: any
  forwardProps: any
  date?: Date
}

export type WizardStep = {
  field: string,
  title: string,
  subtitle: string,
  forwardProps?: Array<string>,
  buildQuery?: (any) => Object
  FormComponent: ({ onChange }: WizardStepFormProps) => React.ReactElement
}

export type WizardFlow = Array<WizardStep>
