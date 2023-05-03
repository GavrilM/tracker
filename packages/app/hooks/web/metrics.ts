import { gql, useMutation, useQuery } from "@apollo/client"
import { Metric } from "../types/Metric"
import { useUserId } from "./user"
import { withOwnerId } from "../common"
import { QueryResult } from "../types/QueryResult"

const ALL_METRICS = gql`
  query AllMetrics {
    metrics {
      name
      units
      limits {
        min
        max
      }
      question_freq {
        days
        weekdays
      }
      target_value
      view {
        type
        base_unit
        weekday
        weekdays
        month_date
      }
      points_default {
        timestamp
        value
      }
    }
  }
`

const CREATE_METRIC = gql`
  mutation CreateMetric($data: MetricInsertInput!) {
    insertOneMetric(data: $data) {
      name
      view {
        type
        base_unit
      }
    }
  }
`

const LIST_METRICS = gql`
  query ListMetrics {
    metrics {
      _id
      name
      view {
        type
      }
    }
  } 
`

const SINGLE_METRIC = gql`
  query ListMetrics($query: MetricQueryInput!) {
    metric(query: $query) {
      name
      units
      limits {
        min
        min_label
        max
        max_label
      }
      question_freq {
        days
        weekdays
      }
      target_value
      view {
        type
        base_unit
        weekday
        weekdays
        month_date
      }
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

export const useCreateMetric = () => {
  const id = useUserId()
  const [fn] = useMutation(CREATE_METRIC)
  const mutation = (data) => {
    const metric = withOwnerId(data, id) 
    fn({
      variables: {
        data: metric
      },
      optimisticResponse: {
        insertOneMetric: {
          id: 'temp-id',
          __typename: "Metric",
          ...metric
        }
      }
    })
  }
  return [mutation]
}

export const useListMetrics = (): QueryResult<Array<Metric>> => {
  const { loading, error, data } = useQuery(LIST_METRICS)
  if (error)
    console.log(error)
  return {
    loading,
    data: data?.metrics
  }
}

export const useSingleMetric = (_id: string): QueryResult<Metric> => {
  const { loading, error, data } = useQuery(SINGLE_METRIC, {
    variables: {
      query: {_id}
    }
  })
  if (error)
    console.log(error)

  return {
    loading,
    data: data?.metric
  }
}