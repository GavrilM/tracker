import { Edit2, Trash } from "@tamagui/lucide-icons";
import { Card, SizableText, XStack, YStack } from "tamagui";
import { MetricType } from "../board/CellTypes";

type EditItemProps = {
  name: string
  view: {
    type: MetricType
  }
}

export function EditItem({name, view}: EditItemProps) {
  return (
    <Card width="100%" p="$3">
      <XStack f={1} jc="space-between">
        <YStack>
          <SizableText color='$gray1Light' fow="700">{name}</SizableText>
          <SizableText>{view.type}</SizableText>
        </YStack>
        <XStack ai="center" ml="$3">
          <YStack p={12}><Edit2 opacity={.5}/></YStack>
          <YStack p={12}><Trash opacity={.5}/></YStack>
        </XStack>
      </XStack>
    </Card>
  )
}