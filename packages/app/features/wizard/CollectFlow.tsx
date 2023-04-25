import { NumberInput, XStack } from "@my/ui";
import { WizardFlow } from "./WizardTypes";

export const CollectFlow: WizardFlow = [
  {
    field: '',
    title: 'Question?',
    subtitle: '',
    FormComponent: props => (
      <NumberInput {...props} autofocus/>
    )
  },
]

export function CollectReview() {
  return <XStack />
}
// missed targets
// missed goals
// completed goals
// met/exceeded targets
// goals in progress
// streaks kept/lost
// 
