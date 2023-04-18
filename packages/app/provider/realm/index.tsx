export const RealmProvider = ({ appId, children }) => {
  return (
    <>
      {children}
    </>
  )
}

export function useRealmApp() {
  return {
    ...(new Realm.App('')),
    logOut: () => {},
    logIn: (credentials: any) => {}
  }
}