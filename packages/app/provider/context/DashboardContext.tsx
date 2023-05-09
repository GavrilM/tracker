import { Dashboard, DummyDashboard } from "app/hooks/types/Dashboard";
import { createContext, useContext, useState } from "react";

const DashboardContext = createContext({board: DummyDashboard , setBoard: (board: Dashboard) => {}})

export function DashboardProvider({children}) {
  const [board, setBoard] = useState<Dashboard>(DummyDashboard)
  return (
    <DashboardContext.Provider value={{board, setBoard}}>
      {children}
    </DashboardContext.Provider>
  )
}

export const useSetDashboard = () => {
  const {setBoard} = useContext(DashboardContext)
  return setBoard
}

export const useDashboard = () => {
  const {board} = useContext(DashboardContext)
  return board
}
