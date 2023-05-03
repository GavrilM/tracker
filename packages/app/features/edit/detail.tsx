import { H1, Spinner } from "@my/ui";
import { useSingleMetric } from "app/hooks";
import { createParam } from "solito";

const { useParam } = createParam()

export function EditDetail() {
  const [id] = useParam('id')
  const {loading, data} = useSingleMetric(id || '')
  
  if (loading || !id) {
    return <Spinner />
  }

  return <H1>Details</H1>
}