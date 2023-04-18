import * as Realm from "realm-web";
import {
  ApolloClient,
  ApolloProvider,
  HttpLink,
  InMemoryCache,
} from "@apollo/client";

const APP_ID = 'tracker-ichjw'
const graphqlUri = `https://us-east-1.aws.realm.mongodb.com/api/client/v2.0/app/${APP_ID}/graphql`

const client = new ApolloClient({
  link: new HttpLink({
    uri: graphqlUri,
    fetch: async (uri, options) => {
      const accessToken = await getValidAccessToken();
      options.headers.Authorization = `Bearer ${accessToken}`;
      return fetch(uri, options);
    },
  }),
  cache: new InMemoryCache(),
});
const app = new Realm.App(APP_ID);

export const DataPlatformProvider = ({ children }) => {
  return (
    <ApolloProvider client={client}>
        {children}
    </ApolloProvider>
  )
}

async function getValidAccessToken() {
  // Guarantee that there's a logged in user with a valid access token
  if (!app.currentUser) {
    // If no user is logged in, log in an anonymous user. The logged in user will have a valid
    // access token.
    await app.logIn(Realm.Credentials.anonymous());
  } else {
    // An already logged in user's access token might be stale. Tokens must be refreshed after 
    // 30 minutes. To guarantee that the token is valid, we refresh the user's access token.
    await app.currentUser.refreshAccessToken();
  }
  return app.currentUser?.accessToken;
}