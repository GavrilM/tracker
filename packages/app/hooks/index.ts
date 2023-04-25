import { Metric } from "./types/Metric"
import { QueryResult } from "./types/QueryResult"

export function useUserorRedirect() {
  return null;
}

export function useUserId() {
  return ''
}

export function useUserData() {
  return {
    loading: false,
    userData: { user_id: '', boards: [] }
  }
}

export const useMetrics = (): QueryResult<Array<Metric>> => {
  return {
    loading: false,
    data: []
  }
}

export const useCreateMetric = () => {}

export const useCollectPoint = () => {}