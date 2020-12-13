import { createSchema, Type, typedModel } from 'ts-mongoose'
import uniqueValidator from 'mongoose-unique-validator'

const userSchema = createSchema({
  username: Type.string({
    required: true,
    unique: true,
    minlength: 4
  }),
  passwordHash: Type.string({
    required: true,
    minlength: 8
  }),
})

userSchema.plugin(uniqueValidator)

const User = typedModel('User', userSchema)

export default User