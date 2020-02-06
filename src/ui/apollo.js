import ApolloClient from 'apollo-boost'
import Cookies from 'universal-cookie';

/*global process*/
let uri = "http://localhost:4000/graphql"
if (process.env.REACT_APP_NODE_ENV === "production") uri = "https://apollo.agropatterns.com/graphql"
else if (process.env.REACT_APP_NODE_ENV === "staging") uri = "https://apollo-staging.agropatterns.com/graphql"
const clientName = (process.env.REACT_APP_NODE_ENV || 'local')+'-ap-forcasting'
const cookies = new Cookies();
const client = new ApolloClient({
  uri,
  request: operation => {
    let authorizationid = '', authorizationhex = '', groupid = '';
    let data = cookies.get(process.env.REACT_APP_NODE_DEV ? 'local' : process.env.REACT_APP_NODE_ENV)
    if (data) {
      authorizationid = data.userId || ''
      authorizationhex = data.passhex || ''
      groupid = data.groupId || ''
    }
    return operation.setContext(() => ({
      headers: {
        authorizationid, authorizationhex, groupid,
        'client-name': clientName,
        'client-version': '1.0.0'
      }
    }))
  }
})

export default client;
