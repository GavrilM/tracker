import { DataPlatformContext } from "./DataPlatform"
import { GqlPlatform } from "./GqlPlatform"

export const DataPlatformProvider = ({ children }) => {
  return (
    <DataPlatformContext.Provider value={GqlPlatform}>
      {children}
    </DataPlatformContext.Provider>
  )
}