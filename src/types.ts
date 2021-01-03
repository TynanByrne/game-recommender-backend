export interface GamesResult {
  count: number
  next?: string
  previous?: string
  results: Array<GameItem>
}

export interface GameItem {
  id: number
  slug: string
  released: string
  tba: boolean
  background_image: string
  rating: number
  rating_top: number
  ratings: Array<Rating>
  ratings_count: number
  reviews_text_count: number
  added: number
  added_by_status: AddedByStatus
  metacritic?: number
  playtime: number
  suggestions_count: number
  updated: string
  user_game?: string | undefined
  reviews_count: number
  saturated_color: string
  dominant_color: string
  platforms: Array<Platform>
  parent_platforms: Array<ParentPlatform>
  genres: Array<Genre>
  stores: Array<Store>
  clip: Clip
  tags: Array<Tag>
  short_screenshots: Array<ShortScreenshot>
}

export interface SingleGame {
  id: number
  slug: string
  name: string
  description: string
  metacritic: number
  released: string
  background_image: string
  background_image_additional: string
  website: string
  reddit_url: string
  reddit_name: string
  alternative_names: [string]
  parent_platforms: [ParentPlatform]
  stores: [Store]
  developers: [Developer]
  genres: [Genre]
  tags: [Tag]
  esrb_rating: ESRBRating
  clip: Clip
}

interface Developer {
  id: number
  name: string
}

interface ESRBRating {
  id: number
  name: string
  slug: string
}

interface Rating {
  id: number
  title: string
  count: number
  percent: number
}

interface AddedByStatus {
  yet: number
  owned: number
  beaten: number
  toplay: number
  dropped: number
  playing: number
}

interface Platform {
  platform: PlatformDetail
  released_at: string
  requirements_en?: Requirements
  requirements_ru?: Requirements
}

interface PlatformDetail {
  id: number
  name: string
  slug: string
  image?: string
  year_end?: string | number | undefined
  year_start?: string | number | undefined
  games_count: number
  image_background: string
}

interface Requirements {
  minimum: string
  recommended: string
}

export type ParentPlatform = Pick<PlatformDetail, 'id' | 'name' | 'slug'>

interface Genre {
  id: number
  name: string
  slug: string
  games_count: number
  image_background: string
}

interface Store {
  id: number
  name: string
  store: StoreDetail
}

interface StoreDetail {
  id: number
  name: string
  slug: string
  domain: string
  games_count: number
  image_background: string
}

interface Clip {
  clip: string
  clips: {
    320: string
    640: string
    full: string
  }
  video: string
  preview: string
}

interface Tag {
  id: number
  name: string
  slug: string
  language: string
  games_count: number
  image_background: string
}

interface ShortScreenshot {
  id: number
  image: string
}

export interface User {
  username: string
  passwordHash: string
}