import { YStack, Spinner, EditItem, ScrollView } from "@my/ui"
import { useListMetrics, useUserorRedirect } from "app/hooks"
import { useSetNavTitle } from "app/provider/context/NavTitleContext"
import { useRouter } from "solito/router"

export const EditScreen = () => {
  const user = useUserorRedirect()
  const {loading, data} = useListMetrics()
  const { push } = useRouter()
  const setTitle = useSetNavTitle()

  if (loading || !user) {
    return <Spinner />
  }

  return (
    <ScrollView f={1} ai="center" p="$4" space>
      {data.map((m,i) => (
        <EditItem key={i} {...m} 
          onEdit={() => {
            setTitle(m.name)
            push(`edit/${m._id}`)
          }} onTrash={() => {}}/>
      ))}
    </ScrollView>
  )
}