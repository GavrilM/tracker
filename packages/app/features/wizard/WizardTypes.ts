export enum WizardType {
  metric,
  goal,
  collect
}

type WizardStepFormProps = {
  onChange: (any) => void
  defaultValue?: any
  forwardProps: any
  date?: Date
  errorMessage?: string
}

export type WizardStep = {
  field: string
  title: string
  subtitle: string
  forwardProps?: Array<string>
  buildQuery?: (any) => Object
  autofill?: (any) => Object
  skippable?: boolean
  validate: (stepValue: any) => string | null,
  FormComponent: (WizardStepFormProps) => React.ReactElement
}

export type WizardFlow = Array<WizardStep>
