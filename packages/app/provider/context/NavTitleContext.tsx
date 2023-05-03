import { createContext, useContext, useState } from "react";

const TitleContext = createContext({title: '', setTitle: t => {}})

export function NavTitleProvider({children}) {
  const [title, setTitle] = useState('')
  return (
    <TitleContext.Provider value={{title, setTitle}}>
      {children}
    </TitleContext.Provider>
  )
}

export const useSetNavTitle = () => {
  const {setTitle} = useContext(TitleContext)
  return setTitle
}

export const useNavTitle = () => {
  const {title} = useContext(TitleContext)
  return title
}
