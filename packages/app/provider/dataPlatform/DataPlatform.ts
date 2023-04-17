import { createContext } from "react"

export const DataPlatformContext = createContext({})

export interface DataPlatform {
  useMetrics: () => [string];
}