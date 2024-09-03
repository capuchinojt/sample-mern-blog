import express from "express"
import "dotenv/config"
import cors from "cors"
import cookieParser from "cookie-parser"

import "./dbs/init.database.js"
import userRoutes from './routes/user.route.js'
import authRoutes from './routes/auth.route.js'
import postRoutes from './routes/post.route.js'
import { handleError } from "./controllers/error.controller.js"
import { logAction } from './utils/logger.js'

const PORT = process.env.PORT || 9999
const app = express()
app.use(express.json())
app.use(
  cors({
      credentials: true,
      origin: "http://localhost:5173",
  })
);
app.use(cookieParser())

app.listen(PORT, () => {
  logAction(`Server started`, 'info', { port: PORT })
  console.log(`Server is running on port: ${PORT}`)
})

app.use('/api/v1/user', userRoutes)
app.use('/api/auth', authRoutes)
app.use('/api/post', postRoutes)

// Middleware to handle errors
app.use((err, req, res, next) => {
  logAction(`Error occurred`, 'error', { error: err.message, stack: err.stack })
  handleError(err, req, res, next)
})

app.use('/', (req, res) => {
  logAction(`Welcome request received`, 'info', { ip: req.ip })
  res.send('Welcome to API server!!').status(200).end()
})