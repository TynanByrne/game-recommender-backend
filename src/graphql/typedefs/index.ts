import { gql } from 'apollo-server'

const typeDefs = gql`
  type ShortScreenshot {
    id: ID!
    image: String!
  }
  type Tag {
    id: ID!
    name: String
    slug: String
    language: String
    games_count: Int
    image_background: String
  }
  input TagInput {
    id: ID!
    name: String
    slug: String
    language: String
    games_count: Int
    image_background: String
  }
  type ClipSizes {
    _320: String
    _640: String
    full: String
  }
  type Clip {
    clip: String
    clips: ClipSizes
    video: String
    preview: String
  }
  type StoreDetail {
    id: ID!
    name: String!
    slug: String!
    domain: String!
    games_count: Int!
    image_background: String!
  }
  type Store {
    id: ID!
    url: String!
    store: StoreDetail
  }
  type Genre {
    id: ID!
    name: String
    slug: String
    games_count: Int!
    image_background: String
  }
  input GenreInput {
    id: ID!
    name: String
    slug: String
    games_count: Int!
    image_background: String
  }
  type ParentPlatformDetails {
    id: ID
    name: String
    slug: String
  }
  type ParentPlatform {
    platform: [ParentPlatformDetails]
  }
  type Requirements {
    minimum: String
    recommended: String
  }
  type PlatformDetail {
    id: ID!
    name: String
    slug: String
    image: String
    year_end: String
    year_start: String
    games_count: Int
    image_background: String
  }
  type Platform {
    platform: PlatformDetail
    released_at: String
    requirements_en: Requirements
    requirements_ru: Requirements
  }
  type AddedByStatus {
    yet: Int
    owned: Int
    beaten: Int
    toplay: Int
    dropped: Int
    playing: Int
  }
  type Rating {
    id: ID!
    title: String
    count: Int
    percent: Float
  }
  type GameItem {
    id: ID!
    slug: String!
    name: String!
    released: String
    tba: Boolean!
    background_image: String
    rating: Float
    rating_top: Float
    ratings: [Rating]
    reviews_text_count: Int
    added: Int
    added_by_status: AddedByStatus
    metacritic: Int
    playtime: Int
    suggestions_count: Int
    updated: String!
    user_game: String
    reviews_count: Int!
    saturated_color: String!
    dominant_color: String!
    platforms: [Platform]
    parent_platforms: [ParentPlatform]
    genres: [Genre]
    stores: [Store]
    clip: Clip
    tags: [Tag]
    short_screenshots: [ShortScreenshot]
  }
  type GamesResult {
    count: Int
    next: String
    previous: String
    results: [GameItem!]
  }
  type User {
    username: String!
    passwordHash: String!
    id: ID!
    library: String
  }
  type Token {
    value: String!
  }
  type DeleteMsg {
    success: String!
  }
  type Developer {
    id: ID!
    name: String!
  }
  type ESRBRating {
    id: ID!
    name: String!
    slug: String!
  }
  type SingleGame {
    id: ID!
    slug: String!
    name: String!
    description: String
    metacritic: Int
    released: String!
    background_image: String!
    background_image_additional: String
    website: String
    reddit_url: String
    reddit_name: String
    alternative_names: [String]
    parent_platforms: [ParentPlatform]
    stores: [Store]
    developers: [Developer]
    genres: [Genre]
    tags: [Tag]
    esrb_rating: ESRBRating
    clip: Clip
  }
  input ParentPlatformInput {
    platform: PlatformDetailsInput
  }
  input PlatformDetailsInput {
    id: ID!
    name: String
    slug: String
  }
  input GameInput {
    numberId: ID!
    name: String!
    metacritic: Int
    released: String!
    background_image: String!
    parent_platforms: [ParentPlatformInput]
    genres: [GenreInput]
    tags: [TagInput]
  }
  type DatabaseGame {
    numberId: ID!
    name: String!
    metacritic: Int
    released: String!
    background_image: String!
    parent_platforms: [ParentPlatform]
    genres: [Genre]
    tags: [Tag]
  }
  type GameObjectID {
    _id: String!
  }
  type LibraryGames {
    wishlist: [GameObjectID]
    completed: [GameObjectID]
    playing: [GameObjectID]
    unfinished: [GameObjectID]
    notStarted: [GameObjectID]
  }
  type Library {
    games: LibraryGames
    totalGames: Int!
  }
  type Query {
    hello: String!
    goodbye: String!
    games: GamesResult!
    searchGames(searchTerm: String!): GamesResult!
    nextSet(url: String): GamesResult!
    allUsers: [User]
    me: User
    singleGame(id: Int!): SingleGame
    myLibrary(libraryId: String!): Library
    fetchGameData(gameId: String!): DatabaseGame
    fetchGameObjectId(gameRawgId: Int!): String
  }
  type Mutation {
    addUser(
      username: String!
      password: String!
    ): User
    login(
      username: String!
      password: String!
    ): Token
    deleteUser(
      username: String!
      password: String!
    ): DeleteMsg
    changePassword(
      username: String!
      password: String!
      newPassword: String!
    ): User
    addGame(
      username: String!
      gameCategory: String!
      gameId: Int!
    ): Library
    editGame(
      username: String!
      oldCategory: String!
      newCategory: String!
      gameId: Int!
    ): Library
    removeGame(
      username: String!
      gameId: Int!
    ) : Library
  }
`

export default typeDefs