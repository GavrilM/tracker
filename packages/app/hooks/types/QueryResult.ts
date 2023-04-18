export type QueryResult<T> = {
  loading: boolean,
  error?: Error,
  data: T
}