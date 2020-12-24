import User, { UserDoc } from "../../models/user"
import * as bcrypt from 'bcrypt'
import * as jwt from 'jsonwebtoken'
import { UserInputError } from "apollo-server"
import config from '../../config'


const JWT_SECRET = config.JWT_SECRET
if (JWT_SECRET === undefined) throw new Error('Could not find JWT_SECRET...')
export interface UserArgs {
  username: string
  password: string
}
export interface DeleteArgs {
  success: string
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
  deleteUser: async (_root: never, args: UserArgs): Promise<DeleteArgs> => {
    const user = await User.findOne({ username: args.username })

    const passwordCorrect = user === null
      ? false
      : await bcrypt.compare(args.password, user.passwordHash)
    
    if (!(user && passwordCorrect)) {
      throw new UserInputError('Wrong credentials.')
    }

    await User.findByIdAndDelete(user._id)

    return { success: `User ${args.username} was successfully deleted.`}

  }
}

export default mutations