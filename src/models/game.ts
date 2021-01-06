import mongooseUniqueValidator from 'mongoose-unique-validator'
import { createSchema, ExtractDoc, ExtractProps, Type, typedModel } from 'ts-mongoose'

const gameSchema = createSchema({
  numberId: Type.number({
    required: true,
    unique: true,
  }),
  name: Type.string({
    required: true,
  }),
  metacritic: Type.number(),
  released: Type.string(),
  background_image: Type.string(),
  tags: Type.array().of({
    id: Type.number(),
    name: Type.string(),
  }),
  parent_platforms: Type.array().of({
    platform: Type.array().of({
      id: Type.number(),
      name: Type.string(),
    }),
  }),
  genres: Type.array().of({
    id: Type.number(),
    name: Type.string(),
  }),
})

gameSchema.plugin(mongooseUniqueValidator)

export const GameSchema = gameSchema

export type GameDoc = ExtractDoc<typeof gameSchema>
export type GameProps = ExtractProps<typeof gameSchema>

const Game = typedModel('Game', gameSchema)

export default Game