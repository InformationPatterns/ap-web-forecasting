import { ApolloClient } from 'apollo-client';
import { InMemoryCache } from 'apollo-cache-inmemory';
import { HttpLink } from 'apollo-link-http';

// import { resolvers, typeDefs } from './resolvers';

const cache = new InMemoryCache();
const client = new ApolloClient({
  cache,
  link: new HttpLink({
    uri: 'http://localhost:4000/graphql',
    headers: {
      authorizationid: localStorage.getItem('authorizationid'),
      authorizationhex: localStorage.getItem('authorizationhex'),
      groupid: localStorage.getItem('groupid'),
      'client-name': 'AP-Forcasting',
      'client-version': '1.0.0',
    },
  }),
  // resolvers,
  // typeDefs,
});

export default client;
