import { useQuery, gql, useMutation } from "@apollo/client";
import { useEffect, useState } from "react";
import * as Realm from "realm-web";
import { QueryResult } from "./types/QueryResult";
import { Metric } from "./types/Metric";
import { useRealmApp } from "app/provider/realm";
import { useRouter } from "solito/router";
import { routes } from "app/navigation/web";

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

export const useUserorRedirect = () => {
  const { currentUser } = useRealmApp()
  const router = useRouter()
  useEffect(() => {
    if(!currentUser)
      router.replace(routes.login)
  }, [currentUser])
  return currentUser
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