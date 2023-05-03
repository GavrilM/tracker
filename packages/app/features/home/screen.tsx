import {
  Button,
  Cell,
  ScrollView,
  Sheet,
  Spinner,
  XStack,
  useToast,
} from '@my/ui'
import { ChevronDown, ChevronUp } from '@tamagui/lucide-icons'
import { useMetrics, useUserorRedirect } from 'app/hooks'
import React, { useState } from 'react'

export function HomeScreen() {
  const user = useUserorRedirect()
  const {loading, data} = useMetrics()

  if (loading || !user) {
    return <Spinner />
  }

  let list = data.map((m, i) => {
    return (
      <Cell key={i} {...m} points={m.points_default} />
    )
  })

  
  return (
    <ScrollView>
      <XStack f={1} flexWrap='wrap' ac="flex-start">
        {list}
      </XStack>
    </ScrollView>
  )
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
