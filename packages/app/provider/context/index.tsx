import { DashboardProvider } from "./DashboardContext";
import { NavActionProvider } from "./NavActionContext";
import { NavTitleProvider } from "./NavTitleContext";

export const NavProviders = ({children}) => (
  <NavActionProvider>
    <NavTitleProvider>
      <DashboardProvider>
        {children}
      </DashboardProvider>
    </NavTitleProvider>
  </NavActionProvider>
)