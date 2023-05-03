import { gql, useMutation, useQuery } from "@apollo/client"
import { useUserId } from "./user"
import { genQuestionReview, genQuestions, withOwnerId } from "../common"
import { CollectReview, QueryResult } from "../types/QueryResult"
import { Metric } from "../types/Metric"
import { useMemo } from "react"


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
      view {
        type
      }
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

const COLLECT_POINTS = gql`
  mutation CollectPoints($points: [PointInsertInput!]!, $notes: [NoteInsertInput!]!) {
    insertManyPoints(data: $points) {
      insertedIds
    }
    insertManyNotes(data: $notes) {
      insertedIds
    }
  }
`

const REVIEW_POINTS = gql`
  query ReviewPoints($query: MetricQueryInput!) {
    metrics(query: $query) {
      _id
      name
      target_value
      units
      view {
        type
      }
    }
  }
`

export const useCollectPoint = () => {
  return useMutation(COLLECT_POINT)
}

export const useCollectPoints = () => {
  const id = useUserId()
  const [fn] = useMutation(COLLECT_POINTS)
  const mutation = (data: Array<any>) => {
    const notes: object[] = []
    const points = Object.values(data)
      .filter(p => p != undefined)
      .map(p => {
      if(p.note) {
        notes.push(withOwnerId(p.note, id))
        p.note = undefined
      }
      return withOwnerId(p, id)
    })
    fn({
      variables: {
        points,
        notes
      }
    })
  }
  return [mutation]
}

export const useCollectQuestions = (date: string): QueryResult<Array<Metric>> => {
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

export const useCollectReview = (points): QueryResult<CollectReview> => {
  const pointLookup = useMemo(() => {
    const obj = {}
    Object.keys(points).forEach(k => points[k] ? obj[k] = points[k] : null)
    return obj
  }, [points])

  const { loading, error, data } = useQuery(REVIEW_POINTS, {
    variables: {
      query: {_id_in: Object.keys(pointLookup) }
    }
  })
  if (error)
    console.log(error)

  let result
  if(!loading && data) {
    result = genQuestionReview(data.metrics, pointLookup)
  }
  return {
    loading,
    data: result
  }
}