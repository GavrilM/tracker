import { WizardType } from 'app/features/wizard/WizardTypes'
import { WizardScreen } from 'app/features/wizard/screen'

export default function CollectScreen(){
  return (
    <WizardScreen wizardType={WizardType.collect} />
  )
} 