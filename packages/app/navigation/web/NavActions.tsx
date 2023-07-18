import { FormButton, XStack } from "@my/ui"
import { routes } from "."
import { NavActionState, useNavAction, useSetNavAction } from "app/provider/context/NavActionContext"
import { useLink } from "solito/link"
import { CheckCircle, XCircle } from "@tamagui/lucide-icons"

type NavActionProps = {
  pathname: string
  onSheetOpen: () => void
  saveText?: string
  exitText?: string
}

export const NavActions = ({ pathname, onSheetOpen }: NavActionProps) => {
  const {save, close, state} = useNavAction()
  const setNavAction = useSetNavAction()

  const collectLink = useLink({href: routes.collect})

  if(pathname === routes.home) {
    if(state === NavActionState.Editing)
      return (
        <XStack space>
          <FormButton onPress={() => setNavAction({state: NavActionState.None})}
            type="secondary">Exit without saving</FormButton>
          <FormButton onPress={save} type="primary">Save layout</FormButton>
        </XStack>
      )
    return (
      <XStack space>
        <FormButton onPress={() => setNavAction({state: NavActionState.Editing})}
          type="primary">Edit</FormButton>
        {/* <FormButton type="primary">Add Goal</FormButton> */}
        <FormButton onPress={onSheetOpen} type="primary">Add Cell</FormButton>
        <FormButton {...collectLink} type="save" icon={CheckCircle}>Collect Data</FormButton>
      </XStack>
    )
  } else if(pathname !== routes.edit && pathname?.includes(routes.edit)) {
    return (
      <XStack space>
        <FormButton onPress={close} type="secondary" icon={<XCircle/>}>Exit without saving</FormButton>
        <FormButton onPress={save} type="primary">Save changes</FormButton>
      </XStack>
    )
  } else if(pathname === routes.collect) {
    return (
      <XStack space>
        <FormButton onPress={close} type="secondary" icon={XCircle}>Exit without saving</FormButton>
        <FormButton onPress={save} type="save" icon={CheckCircle}>Save and exit</FormButton>
      </XStack>
    )
  }
  return <></>
}