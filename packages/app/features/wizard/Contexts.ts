import { getCurrentDate } from "app/hooks/common";
import { createContext } from "react";

export const CollectDateContext = createContext(getCurrentDate())
