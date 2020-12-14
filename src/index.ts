import { ApolloServer } from 'apollo-server'
import mongoose = require('mongoose')
import resolvers from './graphql/resolvers'
import typeDefs from './graphql/typedefs'

const MONGODB_URI = process.env.MONGODB_URI ? process.env.MONGODB_URI : ''

interface Error {
  message: string
}

mongoose.connect(MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false,
  useCreateIndex: true
})
  .then(() => {
    console.log('Connected to that MONGO')
  })
  .catch((error: Error) => {
    console.log('Error connecting to MongoDB:', error.message)
  })
const server = new ApolloServer({
  typeDefs,
  resolvers,
})

void server.listen().then(( { url } ) => {
  console.log(`Server ready at ${url}`)
})