import { ApolloServer } from 'apollo-server'
import mongoose = require('mongoose')
import * as jwt from 'jsonwebtoken'
import resolvers from './graphql/resolvers'
import typeDefs from './graphql/typedefs'
import config from './config'
import User from './models/user'
import { IncomingMessage } from 'http'

const MONGODB_URI = process.env.MONGODB_URI ? process.env.MONGODB_URI : ''
const JWT_SECRET = config.JWT_SECRET
if (JWT_SECRET === undefined) throw new Error('Could not find JWT_SECRET...')

export interface Error {
  message: string
}
type Req = { req: IncomingMessage }

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
  context: async ({ req }: Req) => {
    const auth = req ? req.headers.authorization : undefined
    if (auth && auth.toLowerCase().startsWith('bearer ')) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const decodedToken: any = jwt.verify(
        auth.substring(7), JWT_SECRET
      )
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      const currentUser = await User.findById(decodedToken.id)
      return { currentUser }
    }
    return { currentUser: null }
  }
})

void server.listen().then(( { url } ) => {
  console.log(`Server ready at ${url}`)
})