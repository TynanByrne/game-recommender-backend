import { GraphQLDateTime } from "graphql-iso-date"
import mutations from "./mutations"
import queries from "./queries"

const resolvers = {
  DateTime: GraphQLDateTime,
  Query: queries,
  Mutation: mutations,
}

export default resolvers