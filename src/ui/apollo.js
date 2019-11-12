import ApolloClient from 'apollo-boost'

/*global process*/
let uri = "http://localhost:4000/graphql"
if (process.env.REACT_APP_NODE_ENV === "production") uri = "https://apollo.agropatterns.com/graphql"
else if (process.env.REACT_APP_NODE_ENV === "staging") uri = "https://apollo-staging.agropatterns.com/graphql"
const clientName = process.env.REACT_APP_NODE_ENV+'-ap-forcasting'

const client = new ApolloClient({
  uri,
  request: operation =>
    operation.setContext(() => ({
      headers: {
        authorizationid: localStorage.getItem('authorizationid'),
        authorizationhex: localStorage.getItem('authorizationhex'),
        groupid: localStorage.getItem('groupid'),
        'client-name': clientName,
        'client-version': '1.0.0'
      }
    }))
})

export default client;
