import { FormButton, XStack } from "@my/ui"
import { routes } from "."
import { useNavAction } from "app/provider/context/NavActionContext"
import { useLink } from "solito/link"

type NavActionProps = {
  pathname: string
  saveText?: string
  exitText?: string
}

export const NavActions = ({ pathname }: NavActionProps) => {
  const {save, close} = useNavAction()

  const goalLink = useLink({href: routes.addgoal})
  const cellLink = useLink({href: routes.addcell})
  const collectLink = useLink({href: routes.collect})
  console.log(save,close)
  if(pathname === routes.home) {
    return (
      <XStack space>
          <FormButton {...goalLink} type="primary">Add Goal</FormButton>
          <FormButton {...cellLink} type="primary">Add Cell</FormButton>
          <FormButton {...collectLink} type="save">Collect Data</FormButton>
      </XStack>
    )
  } else if(pathname !== routes.edit && pathname?.includes(routes.edit)) {
    return (
      <XStack space>
        <FormButton onPress={close} type="danger">Exit without saving</FormButton>
        <FormButton onPress={save} type="primary">Save changes</FormButton>
      </XStack>
    )
  } else if(pathname === routes.collect) {
    return (
      <XStack space>
        <FormButton onPress={close} type="danger">Exit without saving</FormButton>
        <FormButton onPress={save} type="save">Save and exit</FormButton>
      </XStack>
    )
  } else if(pathname === routes.addcell) {
    return (
      <XStack space>
        <FormButton onPress={close} type="danger">Exit without saving</FormButton>
      </XStack>
    )
  }
  return <></>
}