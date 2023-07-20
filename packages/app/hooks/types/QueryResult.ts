export type QueryResult<T> = {
  loading: boolean,
  error?: Error,
  refetch?: () => void
  data: T
}

export type CollectReview = {
  targetsMet: Array<Array<string>>,
  targetsMissed: Array<Array<string>>,
  streaksKept: Array<string>,
  streaksMissed: Array<string>,
  total: number,
}