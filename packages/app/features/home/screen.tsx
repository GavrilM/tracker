import { Spinner } from '@my/ui'
import { useMetrics, useUserorRedirect } from 'app/hooks'
import React, { useEffect, useState } from 'react'
import { CellGrid } from './CellGrid'
import { NavActionState, useNavAction, useSetNavAction } from 'app/provider/context/NavActionContext'
import { EditableCellGrid } from './EditableCellGrid'
import { useDashboard } from 'app/provider/context/DashboardContext'
import { getCurrentDate } from 'app/hooks/common'

export function HomeScreen() {
  const user = useUserorRedirect()
  const { layouts, colors } = useDashboard()
  const { state } = useNavAction()
  const setNavAction = useSetNavAction()
  const {loading, data, refetch} = useMetrics()

  const [date, setDate] = useState(getCurrentDate())

  useEffect(() => {
    if(refetch) {
      setTimeout(() => refetch(), 1500)
      setNavAction({refresh: () => {
        setDate(getCurrentDate())
        refetch()
      }})
    }
  }, [refetch])

  if (loading || !user || !data) {
    return <Spinner />
  }

  const dataMap = {}
  data.forEach(d => dataMap[d._id] = d)

  if(state === NavActionState.Editing)
    return <EditableCellGrid data={dataMap} cellLayouts={layouts} cellColors={colors || {}}/>

  return <CellGrid data={dataMap} cellLayouts={layouts} cellColors={colors || {}} date={date}/>
}
