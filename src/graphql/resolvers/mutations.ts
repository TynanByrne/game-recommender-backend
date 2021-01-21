import User, { UserDoc } from "../../models/user"
import * as bcrypt from 'bcrypt'
import * as jwt from 'jsonwebtoken'
import { ApolloError, UserInputError } from "apollo-server"
import config from '../../config'
import Library, { LibraryDoc } from "../../models/library"
import Game from "../../models/game"
import Axios from "axios"
import { SingleGame } from "../../types"
import Post, { PostDoc } from "../../models/post"


const JWT_SECRET = config.JWT_SECRET
if (JWT_SECRET === undefined) throw new Error('Could not find JWT_SECRET...')

const API_URL = 'https://api.rawg.io/api'
const API_KEY = config.API_KEY
if (API_KEY === undefined) throw new Error('Could not find API_KEY')

export interface UserArgs {
  username: string
  password: string
}
export interface SuccessMsg {
  success: string
}
export interface PasswordChangeArgs {
  username: string
  password: string
  newPassword: string
}
type GameCategory = 'wishlist' | 'completed' | 'playing' | 'not started' | 'unfinished'
export interface AddGameArgs {
  username: string
  gameCategory: GameCategory
  gameId: number
}
export interface EditGameArgs {
  username: string
  oldCategory: GameCategory
  newCategory: GameCategory
  gameId: number
}
export interface RemoveGameArgs {
  username: string
  gameId: number
}
export interface NewPostArgs {
  username: string
  title: string
  text: string
  games: string[]
  platforms: string[]
}
/* interface Recommendation {
  recommender: string
  games: number[]
  text: string
  commments: Comment[]
}
interface Comment {
  commenter: string
  text: string
} */

const validateUser = async (username: string, password: string): Promise<UserDoc> => {
  const user = await User.findOne({ username })

  const passwordCorrect = user === null
    ? false
    : await bcrypt.compare(password, user.passwordHash)

  if (!(user && passwordCorrect)) {
    throw new UserInputError('Wrong credentials.')
  }
  return user
}

const mutations = {
  addUser: async (_root: never, args: UserArgs): Promise<UserDoc> => {
    const saltRounds = 10
    const passwordHash = await bcrypt.hash(args.password, saltRounds)
    const newUser = {
      username: args.username,
      passwordHash,
    }
    const user = new User(newUser)
    const library = new Library({
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      user: user._id,
      games: {
        wishlist: [],
        completed: [],
        playing: [],
        unfinished: [],
        notStarted: [],
      }
    })
    user.library = library
    await user.save()
    await library.save()

    return user.save()
      .catch((error: Error) => {
        throw new UserInputError(error.message, {
          invalidArgs: args
        })
      })
  },
  login: async (_root: never, args: UserArgs): Promise<{ value: string }> => {
    const user = await validateUser(args.username, args.password)

    const userForToken = {
      username: user.username,
      id: user.id,
    }
    return { value: jwt.sign(userForToken, JWT_SECRET) }
  },
  deleteUser: async (_root: never, args: UserArgs): Promise<SuccessMsg> => {
    const user = await validateUser(args.username, args.password)

    await Library.findByIdAndDelete(user.library)
    await User.findByIdAndDelete(user._id)

    return { success: `User ${args.username} was successfully deleted.` }

  },
  changePassword: async (_root: never, args: PasswordChangeArgs): Promise<UserDoc> => {
    const user = await validateUser(args.username, args.password)

    const saltRounds = 10
    const newPasswordHash = await bcrypt.hash(args.newPassword, saltRounds)

    user.passwordHash = newPasswordHash
    return user.save()
  },
  addGame: async (_root: never, args: AddGameArgs): Promise<LibraryDoc> => {
    const user = await User.findOne({ username: args.username })

    if (!user) {
      throw new UserInputError('Username could not be found.')
    }
    if (!user.library) {
      throw new ApolloError("Library could not be found for this user.")
    }

    let game = await Game.findOne({ numberId: args.gameId })
    if (!game) {
      try {
        const { data } = await Axios.get<SingleGame>(
          `${API_URL}/games/${args.gameId}?key=${API_KEY}`
        )
        const newGame = { ...data, numberId: data.id }
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { id, ...rest } = newGame
        game = new Game(rest)
        await game.save()
      } catch (error) {
        console.log(error)
        throw new ApolloError(`Game with id ${args.gameId} could not be fetched.`, error
        )
      }
    }
    console.log(game)
    const library = await Library.findById(user.library)
    if (!library) {
      throw new ApolloError('Library could not be found.')
    }
    if (library.games) {
      switch (args.gameCategory) {
        case 'wishlist':
          library.games.wishlist = library.games.wishlist.concat(game._id)
          break
        case 'completed':
          library.games.completed = library.games.completed.concat(game._id)
          break
        case 'not started':
          library.games.notStarted = library.games.notStarted.concat(game._id)
          break
        case 'playing':
          library.games.playing = library.games.playing.concat(game._id)
          break
        case 'unfinished':
          library.games.unfinished = library.games.unfinished.concat(game._id)
          break
        default:
          throw new ApolloError('Invalid game category.')
      }
      library.markModified('games')
    }
    library.totalGames++
    return await library.save()
  },
  editGame: async (_root: never, args: EditGameArgs): Promise<LibraryDoc> => {
    const user = await User.findOne({ username: args.username })

    if (!user) {
      throw new UserInputError('User could not be found.')
    }
    if (!user.library) {
      throw new ApolloError('Library could not be found for this user.')
    }
    const game = await Game.findOne({ numberId: args.gameId })
    if (!game) {
      throw new ApolloError(`Game with numberId ${args.gameId} could not be found.`)
    }
    const library = await Library.findById(user.library)
    if (!library) {
      throw new ApolloError('Library could not be found')
    }
    if (library.games) {
      const games = library.games
      switch (args.newCategory) {
        case 'wishlist':
          games.wishlist = games.wishlist.concat(game._id)
          break
        case 'completed':
          games.completed = games.completed.concat(game._id)
          break
        case 'not started':
          games.notStarted = games.notStarted.concat(game._id)
          break
        case 'playing':
          games.playing = games.playing.concat(game._id)
          break
        case 'unfinished':
          games.unfinished = games.unfinished.concat(game._id)
          break
        default:
          throw new ApolloError('Invalid game category.')
      }
      switch (args.oldCategory) {
        case 'wishlist':
          games.wishlist = games.wishlist.filter(g =>
            String(g) !== game.id
          )
          break
        case 'completed':
          games.completed = games.completed.filter(g =>
            String(g) !== game.id
          )
          break
        case 'not started':
          games.notStarted = games.notStarted.filter(g =>
            String(g) !== game.id
          )
          break
        case 'playing':
          games.playing = games.playing.filter(g =>
            String(g) !== game.id
          )
          break
        case 'unfinished':
          games.unfinished = games.unfinished.filter(g =>
            String(g) !== game.id
          )
          break
        default:
          throw new ApolloError('Invalid game category.')
      }
      library.markModified('games')
    }
    console.log("FIRED!")
    return await library.save()
  },
  removeGame: async (_root: never, args: RemoveGameArgs): Promise<LibraryDoc> => {
    const user = await User.findOne({ username: args.username })

    if (!user) {
      throw new UserInputError('User could not be found.')
    }
    if (!user.library) {
      throw new ApolloError('Library could not be found for this user.')
    }
    const game = await Game.findOne({ numberId: args.gameId })
    if (!game) {
      throw new ApolloError(`Game with numberId ${args.gameId} could not be found.`)
    }
    const library = await Library.findById(user.library)
    if (!library) {
      throw new ApolloError('Library could not be found')
    }
    if (library.games) {
      const games = library.games
      games.wishlist = games.wishlist.filter(g => String(g) !== game.id)
      games.completed = games.completed.filter(g => String(g) !== game.id)
      games.notStarted = games.notStarted.filter(g => String(g) !== game.id)
      games.playing = games.playing.filter(g => String(g) !== game.id)
      games.unfinished = games.unfinished.filter(g => String(g) !== game.id)
    }
    library.markModified('games')
    library.totalGames--
    return await library.save()
  },
  newPost: async (_root: never, args: NewPostArgs): Promise<PostDoc> => {
    const user = await User.findOne({ username: args.username })
    if (!user) {
      throw new UserInputError('User could not be found.')
    }
    
    const newPost = {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      poster: user._id,
      title: args.title,
      text: args.text,
      games: args.games,
      platforms: args.platforms,
    }
    console.log(newPost)

    const post = new Post(newPost)
    return post.save()
  }
}

export default mutations