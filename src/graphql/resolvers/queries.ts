import { GamesResult, SingleGame } from "../../types"
import axios from 'axios'
import config from '../../config'
import User, { UserDoc } from "../../models/user"
import Library, { LibraryDoc } from '../../models/library'
import { ApolloError } from "apollo-server"
import 'ts-mongoose/plugin'
import { mongo } from "mongoose"
import Game, { GameDoc } from "../../models/game"

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
  searchGames: async (_root: never, { searchTerm }: { searchTerm: string }): Promise<GamesResult> => {
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
  myLibrary: async (_root: never, { libraryId }: { libraryId: string }): Promise<LibraryDoc | null | ApolloError> => {
    try {
      const libraryObjectId = new mongo.ObjectId(libraryId)
      const library = await Library.findById(libraryObjectId)
      return library
    } catch (error) {
      throw new ApolloError(`Library document for ObjectId ${libraryId} could not be fetched.`)
    }
  },
  fetchGameData: async (_root: never, { gameId }: { gameId: string }): Promise<GameDoc | null | ApolloError> =>  {
    try {
      const gameObjectId = new mongo.ObjectId(gameId)
      const game = await Game.findById(gameObjectId)
      return game
    } catch (error) {
      throw new ApolloError(`Game document for ObjectId ${gameId} could not be fetched.`)
    }
  },
  fetchGameObjectId: async (_root: never, { gameRawgId }: { gameRawgId: number }): Promise<string | null | ApolloError> => {
    try {
      const game = await Game.findOne({ numberId: gameRawgId })
      console.log(game)
      if (game && game.id) {
        return game.id
      } else {
        return null
      }
    } catch (error) {
      throw new ApolloError(`Game with number id ${gameRawgId} could not be fetched.`)
    }
  }
}

export default queries