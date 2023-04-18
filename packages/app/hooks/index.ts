import { Metric } from "./types/Metric"
import { QueryResult } from "./types/QueryResult"

export function useUserorRedirect() {
  return null;
}

export const useMetrics = (): QueryResult<Array<Metric>> => {
  console.log('mobile')
  return {
    loading: false,
    data: []
  }
}
