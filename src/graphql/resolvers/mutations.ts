import User, { UserDoc } from "../../models/user"
import * as bcrypt from 'bcrypt'
import * as jwt from 'jsonwebtoken'
import { ApolloError, UserInputError } from "apollo-server"
import config from '../../config'
import Library, { LibraryDoc } from "../../models/library"
import Game from "../../models/game"


const JWT_SECRET = config.JWT_SECRET
if (JWT_SECRET === undefined) throw new Error('Could not find JWT_SECRET...')
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
export interface DatabaseGame {
  id: number
  name: string
  metacritic: number
  released: string
  background_image: string
  tags: {
    id: number
    name: string
  }
  parent_platforms: [{
    id: number
    name: string
  }]
  genres: [{
    id: number
    name: string
  }]
}
type GameCategory = 'wishlist' | 'completed' | 'playing' | 'not started' | 'unfinished'
export interface AddGameArgs {
  username: string
  gameCategory: GameCategory
  game: DatabaseGame
}

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

    return user.save()
      .catch((error: Error) => {
        throw new UserInputError(error.message, {
          invalidArgs: args
        })
      })
  },
  login: async (_root: never, args: UserArgs): Promise<{ value: string }> => {
    const user = await User.findOne({ username: args.username })

    const passwordCorrect = user === null
      ? false
      : await bcrypt.compare(args.password, user.passwordHash)

    if (!(user && passwordCorrect)) {
      throw new UserInputError('Wrong credentials.')
    }

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
    }

    let game = await Game.findOne({ id: args.game.id })
    if (!game) {
      game = new Game(args.game)
      await game.save()
    }
    const library = await Library.findById(user.library)
    if (!library) {
      throw new ApolloError('Library could not be found.')
    }
    if (args.gameCategory === 'wishlist' && library.games) {
      console.log(game._id)
      library.games.wishlist = library.games.wishlist?.concat(game._id)
      library.markModified('games')
      console.log("CONCAT!")
    }
    library.totalGames = library.totalGames + 1
    console.log(library)
    return await library.save()
  },
}

export default mutations