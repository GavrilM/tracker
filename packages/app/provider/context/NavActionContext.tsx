import { createContext, useContext, useState } from "react";
import { useRouter } from "solito/router";

export enum NavActionState {
  None,
  Editing
}

const dummy = {
  save: () => {},
  close: () => {},
  state: NavActionState.None
}

const ActionContext = createContext({actions: dummy, setActions: f => {}})

export function NavActionProvider({children}) {
  const { back } = useRouter()
  const [actions, setActions] = useState({
    save: () => {},
    close: () => back(),
    state: NavActionState.None
  })
  return (
    <ActionContext.Provider value={{actions, setActions}}>
      {children}
    </ActionContext.Provider>
  )
}

export const useSetNavAction = () => {
  const {actions, setActions} = useContext(ActionContext)
  return (obj) => {setActions(Object.assign({}, actions, obj))}
}

export const useNavAction = () => {
  const {actions} = useContext(ActionContext)
  return actions
}
