import { GamesResult } from "../../types"
import axios from 'axios'
import config from '../../config'
import User, { UserDoc } from "../../models/user"

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
  allUsers: async (): Promise<UserDoc[]> => {
    return User.find({})
  },
  me: (_root: never, _args: never, context: Context): UserDoc => {
    return context.currentUser
  }
}

export default queries