import { GamesResult, SingleGame } from "../../types"
import axios from 'axios'
import config from '../../config'
import User, { UserDoc } from "../../models/user"
import { ApolloError } from "apollo-server"

const API_URL = 'https://api.rawg.io/api'
const API_KEY = config.API_KEY
if (API_KEY === undefined) throw new Error('Could not find API_KEY')

interface Context {
  currentUser: UserDoc
}

const emptyResult = {
  count: -1,
  next: undefined,
  previous: undefined,
  results: []
}

const queries = {
  hello: (): string => 'Hello, world!',
  goodbye: (): string => 'Goodbye, world!',
  games: async (): Promise<GamesResult> => {
    try {
      const { data: games } = await axios.get<GamesResult>(`${API_URL}/games?key=${API_KEY}`)
      return games
    } catch (error) {
      console.log(error)
      return emptyResult
    }
    
  },
  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
  searchGames: async (_root: never, { searchTerm }: { searchTerm: string} ): Promise<GamesResult> => {
    try {
      const { data: games } = await axios.get<GamesResult>(
        `${API_URL}/games?key=${API_KEY}&search=${searchTerm}`
      )
      return games
    } catch (error) {
      console.log(error)
      return emptyResult
    }
  },
  singleGame: async (_root: never, { id }: { id: string }): Promise<SingleGame | ApolloError> => {
    try {
      const { data: game } = await axios.get<SingleGame>(
        `${API_URL}/games/${id}?key=${API_KEY}`
      )
      return game
    } catch (error) {
      console.log(error)
      throw new ApolloError(`Game with id ${id} could not be fetched.`)
    }
  },
  allUsers: async (): Promise<UserDoc[]> => {
    return User.find({})
  },
  me: (_root: never, _args: never, context: Context): UserDoc => {
    return context.currentUser
  },
  
}

export default queries