import { Metric } from "./types/Metric"
import { QueryResult } from "./types/QueryResult"

export const useMetrics = (): QueryResult<Array<Metric>> => {
  console.log('mobile')
  return {
    loading: false,
    data: []
  }
}
