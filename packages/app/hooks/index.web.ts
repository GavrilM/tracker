import { useQuery, gql, useMutation } from "@apollo/client";
import { useContext, useEffect } from "react";
import { CollectReview, QueryResult } from "./types/QueryResult";
import { Metric } from "./types/Metric";
import { useRealmApp } from "app/provider/realm";
import { useRouter } from "solito/router";
import { routes } from "app/navigation/web";
import { genQuestionReview, genQuestions } from "./common";
import { CollectDateContext } from "app/features/wizard/Contexts";

const USER_DATA = gql`
  query UserData($query: UserQueryInput) {
    user(query: $query) {
      user_id
      boards {
        _id
      }
    }
  }
`

const ALL_METRICS = gql`
  query AllMetrics {
    metrics {
      name
      units
      view {
        type
        base_unit
        weekday
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
      _id
      name
    }
  }
`

// TODO: accept date as arg to compute last_point
const COLLECT_METRICS = gql`
  query LastPoints {
    metrics {
      _id
      name
      question_freq {
        days
        weekdays
        month_date
      }
      question
      limits {
        max
        max_label
        min
        min_label
      }
      units
      last_point {
        timestamp
      }
    }
  }
`

const COLLECT_POINT = gql`
  mutation CollectPoint($query: PointQueryInput, $data: PointInsertInput!) {
    upsertOnePoint(query: $query, data: $data) {
      _id
      metric_id {
        name
      }
      timestamp
    }
  }
`

const REVIEW_POINTS = gql`
  query ReviewPoints {
    metrics {
      name
      target_value
      units
      last_point {
        value
        timestamp
      }
    }
  }
`

export const useUserorRedirect = () => {
  const { currentUser } = useRealmApp()
  const router = useRouter()
  useEffect(() => {
    if(!currentUser)
      router.replace(routes.login)
  }, [currentUser])
  return currentUser
}

export const useUserId = () => {
  const { currentUser } = useRealmApp()
  return currentUser?.id
}

export const useUserData = () => {
  const { loading, error, data } = useQuery(USER_DATA)
  if (error)
    console.log(error)
  return {
    loading,
    userData: data?.user
  }
}

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
  return useMutation(CREATE_METRIC)
}

export const useCollectPoint = () => {
  return useMutation(COLLECT_POINT)
}

export const useCollectQuestions = (date: Date): QueryResult<Array<Metric>> => {
  const { loading, error, data } = useQuery(COLLECT_METRICS, {
    fetchPolicy: 'network-only',
  })
  if (error)
    console.log(error)

  let result
  if(!loading && data) {
    result = genQuestions(data.metrics, date)
  }
  return {
    loading,
    data: result
  }
}

export const useCollectReview = (): QueryResult<CollectReview> => {
  const date = useContext(CollectDateContext)
  const { loading, error, data } = useQuery(REVIEW_POINTS, {
    fetchPolicy: 'network-only',
  })
  if (error)
    console.log(error)

  let result
  if(!loading && data) {
    result = genQuestionReview(data.metrics, date)
  }
  return {
    loading,
    data: result
  }
}
