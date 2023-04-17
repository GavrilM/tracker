import { DataPlatformContext } from "./DataPlatform"
import { RealmPlatform } from "./RealmPlatform"

export const DataPlatformProvider = ({ children }) => {
  return (
    <DataPlatformContext.Provider value={RealmPlatform}>
      {children}
    </DataPlatformContext.Provider>
  )
}