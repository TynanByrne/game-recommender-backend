import User, { UserDoc } from "../../models/user"
import * as bcrypt from 'bcrypt'

export interface UserArgs {
  username: string
  password: string
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
  }
}

export default mutations