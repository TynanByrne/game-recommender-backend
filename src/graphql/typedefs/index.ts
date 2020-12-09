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
    store: StoreDetail
  }
  type Genre {
    id: ID!
    name: String
    slug: String
    games_count: Int!
    image_background: String
  }
  type ParentPlatform {
    id: ID!
    name: String!
    slug: String!
  }
  type Requirements {
    minimum: String
    recommended: String
  }
  type PlatformDetail {
    id: ID!
    name: String!
    slug: String!
    image: String
    year_end: String
    year_start: String
    games_count: Int!
    image_background: String!
  }
  type Platform {
    platform: PlatformDetail!
    released_at: String
    requirements_en: Requirements
    requirements_ru: Requirements
  }
  type AddedByStatus {
    yet: Int!
    owned: Int!
    beaten: Int!
    toplay: Int!
    dropped: Int!
    playing: Int!
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
    background_image: String!
    rating: Float!
    rating_top: Float
    ratings: [Rating]
    reviews_text_count: Int
    added: Int
    added_by_status: AddedByStatus!
    metacritic: Int
    playtime: Int
    suggestions_count: Int
    updated: String!
    user_game: String
    reviews_count: Int!
    saturated_color: String!
    dominant_color: String!
    platforms: [Platform!]
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
  type Query {
    hello: String!
    goodbye: String!
    games: GamesResult!
  }  
`

export default typeDefs