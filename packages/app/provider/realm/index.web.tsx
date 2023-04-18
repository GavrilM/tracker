import * as Realm from "realm-web";
import {
  ApolloClient,
  ApolloProvider,
  HttpLink,
  InMemoryCache,
} from "@apollo/client";
import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";

function createRealmApp(id) {
  return new Realm.App({ id });
}

const RealmAppContext = createContext<any>(null);

async function getValidAccessToken(app) {
  if (!app.currentUser) {
    // await app.logIn(Realm.Credentials.anonymous());
  } else {
    await app.currentUser.refreshAccessToken();
  }
  return app.currentUser?.accessToken;
}


export function RealmProvider({ appId, children }) {
  const [realmApp, setRealmApp] = useState(createRealmApp(appId));
  useEffect(() => {
    setRealmApp(createRealmApp(appId));
  }, [appId]);

  const [currentUser, setCurrentUser] = useState(realmApp.currentUser);

  const graphqlUri = `https://us-east-1.aws.realm.mongodb.com/api/client/v2.0/app/${appId}/graphql`
  const client = new ApolloClient({
    link: new HttpLink({
      uri: graphqlUri,
      fetch: async (uri, options) => {
        const accessToken = await getValidAccessToken(realmApp);
        options.headers.Authorization = `Bearer ${accessToken}`;
        return fetch(uri, options);
      },
    }),
    cache: new InMemoryCache(),
  });
  
  const logIn = useCallback(
    async (credentials) => {
      await realmApp.logIn(credentials);
      setCurrentUser(realmApp.currentUser);
    },
    [realmApp]
  );
  const logOut = useCallback(async () => {
    try {
      const user = realmApp.currentUser;
      if(!user)
        throw Error("Can't log out without being logged in")
      await user?.logOut();
      await realmApp.removeUser(user);
    } catch (err) {
      console.error(err);
    }
    setCurrentUser(realmApp.currentUser);
  }, [realmApp]);

  const realmAppContext = useMemo(() => {
    return { ...realmApp, currentUser, logIn, logOut };
  }, [realmApp, currentUser, logIn, logOut]);

  return (
    <RealmAppContext.Provider value={realmAppContext}>
      <ApolloProvider client={client}>
        {children}
      </ApolloProvider>
    </RealmAppContext.Provider>
  );
}

export function useRealmApp() {
  const realmApp = useContext(RealmAppContext);
  if (!realmApp) {
    throw new Error(
      `No Realm App found. Make sure to call useRealmApp() inside of a <RealmAppProvider />.`
    );
  }
  return realmApp;
}
