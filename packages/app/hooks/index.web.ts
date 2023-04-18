import { useQuery, gql } from "@apollo/client";
import { useEffect, useState } from "react";
import * as Realm from "realm-web";
import { QueryResult } from "./types/QueryResult";
import { Metric } from "./types/Metric";
import { useRealmApp } from "app/provider/realm";
import { useRouter } from "solito/router";
import { routes } from "app/navigation/web";

const ALL_METRICS = gql`
  query AllMetrics {
    metrics {
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

export const useMetrics = (): QueryResult<Array<Metric>> => {
  const { loading, error, data } = useQuery(ALL_METRICS)
  if (error)
    console.log(error)
  return {
    loading,
    data: data?.metrics
  }
}
