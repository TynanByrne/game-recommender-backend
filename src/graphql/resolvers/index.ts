import mutations from "./mutations"
import queries from "./queries"

const resolvers = {
  Query: queries,
  Mutation: mutations,
}

export default resolvers