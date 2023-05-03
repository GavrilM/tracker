import { Edit2, Trash } from "@tamagui/lucide-icons";
import { Card, SizableText, XStack, YStack } from "tamagui";
import { MetricType } from "../board/CellTypes";
import { DangerDialog } from "../modal/DangerDialog";

type EditItemProps = {
  name: string
  view: {
    type: MetricType
  }
  onEdit: () => void
  onTrash: () => void
}

export function EditItem({name, view, onEdit, onTrash}: EditItemProps) {
  return (
    <Card width="100%" p="$3">
      <XStack f={1} jc="space-between">
        <YStack>
          <SizableText color='$gray1Light' fow="700">{name}</SizableText>
          <SizableText>{view.type}</SizableText>
        </YStack>
        <XStack ai="center" ml="$3">
          <YStack p={12} onPress={onEdit}><Edit2 opacity={.5}/></YStack>
          <DangerDialog title={`Delete ${name}?`} subtitle="All data will be lost"
            onConfirm={onTrash}
            trigger={<YStack p={12}><Trash opacity={.5}/></YStack>}/>
        </XStack>
      </XStack>
    </Card>
  )
}