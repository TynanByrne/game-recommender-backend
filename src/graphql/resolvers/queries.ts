import { GamesResult } from "../../types"
import axios from 'axios'
import config from '../../config'


const API_URL = 'https://api.rawg.io/api'
const API_KEY = config.API_KEY
console.log(API_KEY)

const queries = {
  hello: (): string => 'Hello, world!',
  goodbye: (): string => 'Goodbye, world!',
  games: async (): Promise<GamesResult> => {
    try {
      const { data: games } = await axios.get<GamesResult>(`${API_URL}/games?key=${API_KEY}`)
      console.log("no error")
      console.log(games)
      return games
    } catch (error) {
      console.log(error)
      return {
        count: -1,
        next: undefined,
        previous: undefined,
        results: [],
      }
    }
    
  }
}

export default queries