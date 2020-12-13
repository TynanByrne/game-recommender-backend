import { GamesResult, User as UserType } from "../../types"
import axios from 'axios'
import config from '../../config'
import User, { IUser } from "../../models/user"

const API_URL = 'https://api.rawg.io/api'
const API_KEY = config.API_KEY

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
  searchGames: async (_root: string, { searchTerm }: { searchTerm: string} ): Promise<GamesResult> => {
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
  allUsers: async (): IUser[] => {
    return User.find({})
  },
}

export default queries