import { useQuery, gql, useMutation } from "@apollo/client";
import { useEffect, useState } from "react";
import { QueryResult } from "./types/QueryResult";
import { Metric } from "./types/Metric";
import { useRealmApp } from "app/provider/realm";
import { useRouter } from "solito/router";
import { routes } from "app/navigation/web";
import { genQuestions } from "./common";

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

const COLLECT_METRICS = gql`
  query LastPoints {
    metrics {
      _id
      name
      question_freq {
        days,
        weekdays,
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
  const { loading, error, data } = useQuery(COLLECT_METRICS)
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
