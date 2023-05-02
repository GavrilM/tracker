import { YStack, H1, Spinner, XStack, SizableText, Card, H4, EditItem } from "@my/ui"
import { Edit2, Trash } from "@tamagui/lucide-icons"
import { useListMetrics, useUserorRedirect } from "app/hooks"

export const EditScreen = () => {
  const user = useUserorRedirect()
  const {loading, data} = useListMetrics()

  if (loading || !user) {
    return <Spinner />
  }

  return (
    <YStack f={1} jc="center" ai="center" p="$4" space>
      <YStack space="$4" maw={600} f={1}>
        {data.map((m,i) => (
          <EditItem key={i} {...m} />
        ))}
      </YStack>
    </YStack>
  )
}