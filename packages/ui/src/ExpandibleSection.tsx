import { useState } from 'react'
import { ChevronDown, ChevronRight } from "@tamagui/lucide-icons";
import { SizableText, XStack, YStack } from "tamagui";

type ExpandibleSectionProps = {
  title: string,
  items: Array<string>
  type: "good" | "neutral" | "bad",
  isOpen?: boolean
}

export function ExpandibleSection({ title, items, type, isOpen }: ExpandibleSectionProps) {
  const [open, setOpen] = useState(isOpen || false)
  return (
    <YStack>
      <XStack cursor='pointer' onPress={() => setOpen(!open)}>
        {open ? <ChevronDown/> : <ChevronRight/>}
        <SizableText>{title}</SizableText>
      </XStack>
      {open && items.map((t,i) => (
        <SizableText key={i} ml={30}>{t}</SizableText>
      ))}
    </YStack>
  )
}