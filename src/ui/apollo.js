import ApolloClient from 'apollo-boost'

/*global process*/
let uri = "http://localhost:4000"
if (process.env.REACT_APP_NODE_ENV === "production") uri = "http://167.71.170.147:4000/"
else if (process.env.REACT_APP_NODE_ENV === "staging") uri = "http://167.71.170.147:4000/"
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
