import { MetricType } from "@my/ui"
import { DummyMetric, Metric } from "../types/Metric"
import { QueryResult } from "../types/QueryResult"

export const useMetrics = (): QueryResult<Array<Metric>> => {
  return {
    loading: false,
    data: []
  }
}

export const useCreateMetric = () => {}

export const useListMetrics = (): QueryResult<Array<Metric>> => {
  return {
    loading: false,
    data: []
  }
}

export const useSingleMetric = (_id: string): QueryResult<Metric> => {
  return {
    loading: false,
    data: DummyMetric
  }
}

export const useEditMetric = (_id: string) => {
  return [(any) => {}]
}