import { Metric } from "../types/Metric"
import { CollectReview, QueryResult } from "../types/QueryResult"

export const useCollectPoint = () => {}
export const useCollectPoints = () => {}

export const useCollectQuestions = (date: Date): QueryResult<Array<Metric>> => {
  return {
    loading: false,
    data: []
  }
}

export const useCollectReview = (pointLookup): QueryResult<CollectReview> => {
  return {
    loading: false,
    data: {
      targetsMet: [],
      targetsMissed: [],
      streaksKept: [],
      streaksMissed: [],
      total: 0
    }
  }
}