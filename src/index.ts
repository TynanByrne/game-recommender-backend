import { ApolloServer } from 'apollo-server'
import resolvers from './graphql/resolvers'
import typeDefs from './graphql/typedefs'

const server = new ApolloServer({
  typeDefs,
  resolvers,
})

void server.listen().then(( { url } ) => {
  console.log(`Server ready at ${url}`)
})