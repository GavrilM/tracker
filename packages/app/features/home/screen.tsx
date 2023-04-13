import {
  Button,
  Card,
  Sheet,
  XStack,
  useToast,
} from '@my/ui'
import { ChevronDown, ChevronUp } from '@tamagui/lucide-icons'
import React, { useState } from 'react'

export function HomeScreen() {
  let list: Array<React.ReactElement> = []
  for (let i = 0; i < 10; i++) {
    list.push(<Card key={i} size="$4" bordered width={225} height={225} theme="alt1" mr="$4" mb="$4"/>)
  }
  
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
