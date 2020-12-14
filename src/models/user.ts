import { createSchema, ExtractDoc, ExtractProps, Type, typedModel } from 'ts-mongoose'
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

export type UserDoc = ExtractDoc<typeof userSchema>
export type UserProps = ExtractProps<typeof userSchema>

const User = typedModel('User', userSchema)

export default User