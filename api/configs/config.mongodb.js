'use strict'
import 'dotenv/config'

const dev = {
  app: {
    port: process.env.DEV_APP_PORT || 9999
  },
  db: {
    username: process.env.DEV_DB_USERNAME || 'admin',
    password: process.env.DEV_DB_PASSWORD || '123456',
    name: process.env.DEV_DB_NAME || 'data-for-demo-project'
  }
}

const prod = {
  app: {
    port: process.env.PROD_APP_PORT || 9999
  },
  db: {
    username: process.env.PROD_DB_USERNAME || 'localhost',
    password: process.env.PROD_DB_PASSWORD || 68686,
    name: process.env.PROD_DB_NAME || 'db'
  }
}

const configs = {dev, prod}
const env = process.env.NODE_ENV || 'dev'
export default configs[env]
