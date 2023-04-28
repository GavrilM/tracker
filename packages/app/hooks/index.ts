import { Metric } from "./types/Metric"
import { CollectReview, QueryResult } from "./types/QueryResult"

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
export const useCollectPoints = () => {}

export const useCollectQuestions = (date: Date): QueryResult<Array<Metric>> => {
  return {
    loading: false,
    data: []
  }
}

export const useCollectReview = (): QueryResult<CollectReview> => {
  return {
    loading: false,
    data: {targetsMet: [], targetsMissed: []}
  }
}