export type QueryResult<T> = {
  loading: boolean,
  error?: Error,
  data: T
}

export type CollectReview = {
  targetsMet: Array<string>,
  targetsMissed: Array<string>,
  streaksKept: Array<string>,
  streaksMissed: Array<string>,
  total: number,
}