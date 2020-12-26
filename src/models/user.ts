import { createSchema, ExtractDoc, ExtractProps, Type, typedModel } from 'ts-mongoose'
import uniqueValidator from 'mongoose-unique-validator'
import { librarySchema } from './library'

export const userSchema = createSchema({
  username: Type.string({
    required: true,
    unique: true,
    minlength: 4
  }),
  passwordHash: Type.string({
    required: true,
    minlength: 8
  }),
  library: Type.ref(Type.objectId()).to('Library', librarySchema)
})

userSchema.plugin(uniqueValidator)

export type UserDoc = ExtractDoc<typeof userSchema>
export type UserProps = ExtractProps<typeof userSchema>

const User = typedModel('User', userSchema)

export default User