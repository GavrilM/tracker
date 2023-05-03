import { createContext, useContext, useState } from "react";

const dummy = {
  save: () => {},
  close: () => {},
}

const ActionContext = createContext({actions: dummy, setActions: f => {}})

export function NavActionProvider({children}) {
  const [actions, setActions] = useState(dummy)
  return (
    <ActionContext.Provider value={{actions, setActions}}>
      {children}
    </ActionContext.Provider>
  )
}

export const useSetNavAction = () => {
  const {setActions} = useContext(ActionContext)
  return setActions
}

export const useNavAction = () => {
  const {actions} = useContext(ActionContext)
  return actions
}
