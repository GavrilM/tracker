import { gql, useMutation, useQuery } from "@apollo/client"
import { Metric } from "../types/Metric"
import { useUserId } from "./user"
import { withOwnerId } from "../common"
import { QueryResult } from "../types/QueryResult"
import { useDashboard, useSetDashboard } from "app/provider/context/DashboardContext"
import { ObjectId } from "bson"
import { BoardLayouts } from "../types/Dashboard"
import { useEffect } from "react"

const INITIAL_METRICS = gql`
  query InitialMetrics {
    user {
      initial_board {
        _id
        name
        layouts {
          row_len
          grid 
        }
        colors {
          id
          color
        }
        metrics {
          _id
          name
          units
          limits {
            min
            max
            min_label
            max_label
          }
          question
          question_freq {
            days
            weekdays
          }
          target {
            value
            direction
          }
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
          last_point {
            timestamp
          }
        }
      }
    }
  }
`

const CREATE_METRIC = gql`
  mutation CreateMetric(
    $metric: MetricInsertInput!,
    $boardQuery: BoardQueryInput!,
    $boardUpdate: BoardUpdateInput!)
  {
    insertOneMetric(data: $metric) {
      name
      view {
        type
        base_unit
      }
    }
    updateOneBoard(query: $boardQuery, set: $boardUpdate) {
      _id
    }
  }
`

const EDIT_METRIC = gql`
  mutation EditMetric($query: MetricQueryInput!, $set: MetricUpdateInput!) {
    updateOneMetric(query: $query, set: $set) {
      name
    }
  }
`

const DELETE_METRIC = gql`
  mutation DeleteMetric($id: String!) {
    deleteMetric(input: $id) {
      status
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
      question
      question_freq {
        days
        weekdays
      }
      target {
        direction
        value
      }
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
  const setDashboard = useSetDashboard()
  const { loading, error, data, refetch } = useQuery(INITIAL_METRICS)
  if (error)
    console.log(error)

  useEffect(() => {
    if(data?.user.initial_board) {
      const {_id, name, metrics, layouts, colors} = data.user.initial_board
      const layoutMap: BoardLayouts = {}
      const colorMap = {}
      if(layouts)
        layouts.forEach(l => layoutMap[l['row_len']] = JSON.parse(l['grid']))
      if(colors)
        colors.forEach(c => colorMap[c['id']] = c['color'])
  
      setDashboard({
        _id,
        name,
        metricIds: metrics.map(m => m._id),
        layouts: layoutMap,
        colors: colorMap
      })
    }
  }, [data])

  return {
    loading,
    refetch,
    data: data?.user.initial_board?.metrics,
  }
}

export const useCreateMetric = () => {
  const id = useUserId()
  const { _id, metricIds } = useDashboard()
  const [fn] = useMutation(CREATE_METRIC, {
    refetchQueries: [INITIAL_METRICS]
  })
  const mutation = (data) => {
    const metric = withOwnerId(data, id)
    metric._id = new ObjectId()
    metricIds.push(metric._id)
    fn({
      variables: {
        metric,
        boardQuery: {_id},
        boardUpdate: { metrics: {link: metricIds} }
      },
      optimisticResponse: {
        insertOneMetric: {
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

export const useEditMetric = (_id: string) => {
  const [fn] = useMutation(EDIT_METRIC, {
    refetchQueries: ['InitialMetrics']
  })
  const mutation = (data) => {
    unsetNulls(data)
    const set = JSON.parse(JSON.stringify(data), omitTypename)
    fn({
      variables: {
        query: {_id},
        set
      },
    })
  }
  return [mutation]
}

const omitTypename = (key, value) => (key === '__typename' ? undefined : value);

export const useDeleteMetric = () => {
  return useMutation(DELETE_METRIC, {
    refetchQueries: ['InitialMetrics']
  })
}

function unsetNulls(data) {
  if(!data.target) {
    data.target_unset = true
  }
  if(data.limits.min == undefined) {
    data.limits.min_unset = true
  }
  if(data.limits.max == undefined) {
    data.limits.max_unset = true
  }
}