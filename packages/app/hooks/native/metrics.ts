import { Metric } from "../types/Metric"
import { QueryResult } from "../types/QueryResult"

export const useMetrics = (): QueryResult<Array<Metric>> => {
  return {
    loading: false,
    data: []
  }
}

export const useCreateMetric = () => {}