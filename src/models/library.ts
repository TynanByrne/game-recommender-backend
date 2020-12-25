import { Schema } from 'mongoose'
import { createSchema, ExtractDoc, ExtractProps, Type, typedModel } from 'ts-mongoose'
import { GameSchema } from './game'

export const librarySchema = createSchema({
  games: Type.object().of({
    wishlist: Type.array().of(GameSchema),
    completed: Type.array().of(GameSchema),
    playing: Type.array().of(GameSchema),
    notStarted: Type.array().of(GameSchema)
  }),
  totalGames: Type.number(),
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  }
})



export type LibraryDoc = ExtractDoc<typeof librarySchema>
export type LibraryProps = ExtractProps<typeof librarySchema>

const Library = typedModel('Library', librarySchema)

export default Library
