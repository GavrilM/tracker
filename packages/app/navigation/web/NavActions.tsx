import { FormButton, XStack } from "@my/ui"
import { routes } from "."
import { NavActionState, useNavAction, useSetNavAction } from "app/provider/context/NavActionContext"
import { useLink } from "solito/link"
import { XCircle } from "@tamagui/lucide-icons"

type NavActionProps = {
  pathname: string
  saveText?: string
  exitText?: string
}

export const NavActions = ({ pathname }: NavActionProps) => {
  const {save, close, state} = useNavAction()
  const setNavAction = useSetNavAction()

  const goalLink = useLink({href: routes.addgoal})
  const cellLink = useLink({href: routes.addcell})
  const collectLink = useLink({href: routes.collect})

  if(pathname === routes.home) {
    if(state === NavActionState.Editing)
      return (
        <XStack space>
          <FormButton onPress={() => setNavAction({state: NavActionState.None})}
            type="danger">Exit without saving</FormButton>
          <FormButton onPress={save} type="primary">Save layout</FormButton>
        </XStack>
      )
    return (
      <XStack space>
        <FormButton onPress={() => setNavAction({state: NavActionState.Editing})}
          type="primary">Move</FormButton>
        <FormButton {...goalLink} type="primary">Add Goal</FormButton>
        <FormButton {...cellLink} type="primary">Add Cell</FormButton>
        <FormButton {...collectLink} type="save">Collect Data</FormButton>
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
        <FormButton onPress={close} type="secondary" icon={<XCircle/>}>Exit without saving</FormButton>
        <FormButton onPress={save} type="save">Save and exit</FormButton>
      </XStack>
    )
  } else if(pathname === routes.addcell) {
    return (
      <XStack space>
        <FormButton onPress={close} type="secondary" icon={<XCircle/>}>Exit without saving</FormButton>
      </XStack>
    )
  }
  return <></>
}