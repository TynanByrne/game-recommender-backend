import { createSchema, ExtractDoc, ExtractProps, Type, typedModel } from 'ts-mongoose'
import { GameSchema } from './game'


export const librarySchema = createSchema({
  games: Type.object().of({
    wishlist: Type.array({ required: true }).of(
      Type.ref(Type.objectId()).to('Game', GameSchema)
    ),
    completed: Type.array({ required: true }).of(
      Type.ref(Type.objectId()).to('Game', GameSchema)
    ),
    playing: Type.array({ required: true }).of(
      Type.ref(Type.objectId()).to('Game', GameSchema)
    ),
    unfinished: Type.array({ required: true }).of(
      Type.ref(Type.objectId()).to('Game', GameSchema)
    ),
    notStarted: Type.array({ required: true }).of(
      Type.ref(Type.objectId()).to('Game', GameSchema)
    ),
  }),
  totalGames: Type.number({ default: 0, required: true }),
})



export type LibraryDoc = ExtractDoc<typeof librarySchema>
export type LibraryProps = ExtractProps<typeof librarySchema>

const Library = typedModel('Library', librarySchema)

export default Library
