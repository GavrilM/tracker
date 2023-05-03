import { NavActionProvider } from "./NavActionContext";
import { NavTitleProvider } from "./NavTitleContext";

export const NavProviders = ({children}) => (
  <NavActionProvider>
    <NavTitleProvider>
      {children}
    </NavTitleProvider>
  </NavActionProvider>
)