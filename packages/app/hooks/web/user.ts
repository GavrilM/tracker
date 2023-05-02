import { gql, useQuery } from "@apollo/client"
import { routes } from "app/navigation/web"
import { useRealmApp } from "app/provider/realm"
import { useEffect } from "react"
import { useRouter } from "solito/router"

const USER_DATA = gql`
  query UserData($query: UserQueryInput) {
    user(query: $query) {
      boards {
        _id
      }
    }
  }
`

export const useUserorRedirect = () => {
  const { currentUser } = useRealmApp()
  const router = useRouter()
  useEffect(() => {
    if(!currentUser)
      router.replace(routes.login)
  }, [currentUser])
  return currentUser
}

export const useUserId = () => {
  const { currentUser } = useRealmApp()
  return currentUser?.id
}

export const useUserData = () => {
  const id = useUserId()
  const { loading, error, data } = useQuery(USER_DATA, {
    variables: {
      query: {user_id: id}
    }
  })
  if (error)
    console.log(error)
  return {
    loading,
    userData: data?.user
  }
}