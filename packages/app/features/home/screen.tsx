import {
  Button,
  Card,
  H2,
  Sheet,
  Spinner,
  XStack,
  useToast,
} from '@my/ui'
import { ChevronDown, ChevronUp } from '@tamagui/lucide-icons'
import { useMetrics } from 'app/hooks'
import React, { useState } from 'react'

export function HomeScreen() {
  const {loading, data} = useMetrics()

  if (loading) {
    return <Spinner />
  }

  console.log(data)
  let list = data.map((m, i) => (
    <Card key={i} size="$4" bordered width={225} height={225} theme="alt1" mr="$4" mb="$4" ai="center">
      <Card.Header/>
      <H2 f={1}>{m.name}</H2>
    </Card>
  ))

  
  return (
    <XStack f={1} flexWrap='wrap' ac="flex-start">
      {list}
    </XStack>
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
