import { ApolloServer } from 'apollo-server'

const API_URL = 'https://api.rawg.io/api/'

const server: any = new ApolloServer({
  typeDefs,
  resolvers,
})

server.listen().then(({ url } )) => {
  console.log(`Server ready at ${url}`)
}

