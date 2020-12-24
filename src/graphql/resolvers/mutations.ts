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
export interface SuccessMsg {
  success: string
}
export interface PasswordChangeArgs {
  username: string
  password: string
  newPassword: string
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

    await User.findByIdAndDelete(user._id)

    return { success: `User ${args.username} was successfully deleted.` }

  },
  changePassword: async (_root: never, args: PasswordChangeArgs): Promise<UserDoc> => {
    const user = await validateUser(args.username, args.password)

    const saltRounds = 10
    const newPasswordHash = await bcrypt.hash(args.newPassword, saltRounds)

    user.passwordHash = newPasswordHash
    return user.save()
  }
}

export default mutations