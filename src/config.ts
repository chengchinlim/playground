import { config } from 'dotenv'
config()

export const configs = {
  port: process.env.PORT ?? 8080,
  env: process.env.NODE_ENV ?? 'dev'
}
