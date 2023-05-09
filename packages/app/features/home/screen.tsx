import {
  Button,
  Sheet,
  Spinner,
  useToast,
} from '@my/ui'
import { ChevronDown, ChevronUp } from '@tamagui/lucide-icons'
import { useMetrics, useUserorRedirect } from 'app/hooks'
import React, { useEffect, useState } from 'react'
import { CellGrid } from './CellGrid'
import { NavActionState, useNavAction } from 'app/provider/context/NavActionContext'
import { EditableCellGrid } from './EditableCellGrid'
import { useDashboard } from 'app/provider/context/DashboardContext'

export function HomeScreen() {
  const user = useUserorRedirect()
  const { layouts } = useDashboard()
  const { state } = useNavAction()
  const {loading, data, refetch} = useMetrics()

  useEffect(() => {
    if(refetch)
      setTimeout(() => refetch(), 1500)
  }, [data])

  if (loading || !user || !data) {
    return <Spinner />
  }

  const dataMap = {}
  data.forEach(d => dataMap[d._id] = d)

  if(state === NavActionState.Editing)
    return <EditableCellGrid data={dataMap} cellLayouts={layouts}/>

  return <CellGrid data={dataMap} cellLayouts={layouts}/>
}

function SheetDemo() {
  const [open, setOpen] = useState(false)
  const [position, setPosition] = useState(0)
  const toast = useToast()
  return (
    <>
      <Button
        size="$6"
        icon={open ? ChevronDown : ChevronUp}
        circular
        onPress={() => setOpen((x) => !x)}
      />
      <Sheet
        modal
        open={open}
        onOpenChange={setOpen}
        snapPoints={[80]}
        position={position}
        onPositionChange={setPosition}
        dismissOnSnapToBottom
      >
        <Sheet.Overlay />
        <Sheet.Frame ai="center" jc="center">
          <Sheet.Handle />
          <Button
            size="$6"
            circular
            icon={ChevronDown}
            onPress={() => {
              setOpen(false)
              toast.show('Sheet closed!', {
                message: "Just showing how toast works...",
              })
            }}
          />
        </Sheet.Frame>
      </Sheet>
    </>
  )
}
