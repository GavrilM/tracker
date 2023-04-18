import { useQuery, gql } from "@apollo/client";
import { QueryResult } from "./types/QueryResult";
import { Metric } from "./types/Metric";

const ALL_METRICS = gql`
  query AllMetrics {
    metrics {
      name
    }
  }
`

export const useMetrics = (): QueryResult<Array<Metric>> => {
  const { loading, error, data } = useQuery(ALL_METRICS)
  if (error)
    console.log(error)
  return {
    loading,
    data: data?.metrics
  }
}
