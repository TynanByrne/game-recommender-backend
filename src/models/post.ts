/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
// ts-mongoose documentation uses the 'date' type as shown here, hence
// loosening of the linting rules
import { createSchema, ExtractDoc, Type, typedModel } from "ts-mongoose";
import { GameSchema } from "./game";
import { userSchema } from "./user";

export const postSchema = createSchema({
  poster: Type.ref(Type.objectId()).to('User', userSchema),
  title: Type.string({ required: true, maxlength: 50 }),
  text: Type.string({
    required: true,
    maxlength: 200,
  }),
  game: Type.ref(Type.objectId()).to('Game', GameSchema),
  platforms: Type.array().of(
    Type.string(),
  ),
  recommendations: Type.array().of({
    recommender: Type.ref(Type.objectId()).to('User', userSchema),
    game: Type.ref(Type.objectId()).to('Game', GameSchema),
    text: Type.string({
      required: true,
      maxlength: 200,
    }),
    likes: Type.number({ default: 0 }),
    comments: Type.array().of({
      commenter: Type.ref(Type.objectId()).to('User', userSchema),
      text: Type.string({ maxlength: 140 }),
      likes: Type.number({ default: 0 }),
      timestamp: Type.date({ default: Date.now as any })
    }),
  }),
  timestamp: Type.date({ default: Date.now as any }),
})

export type PostDoc = ExtractDoc<typeof postSchema>

const Post = typedModel('Post', postSchema)

export default Post