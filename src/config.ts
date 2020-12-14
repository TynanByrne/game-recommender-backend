import * as dotenv from 'dotenv'

dotenv.config()


export default {
  API_KEY: process.env.API_KEY,
  JWT_SECRET: process.env.JWT_SECRET
}