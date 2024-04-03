import express from "express"
import "dotenv/config"
import cors from "cors"
import cookieParser from "cookie-parser"

import "./dbs/init.database.js"
import userRoutes from './routes/user.route.js'
import authRoutes from './routes/auth.route.js'
import { handleError } from "./controllers/error.controller.js"

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
  console.log(`Server is running on port: ${PORT}`)
})

app.use('/api/v1/user', userRoutes)
app.use('/api/auth', authRoutes)

// Middleware to handle errors
app.use(handleError)

app.use('/', (req, res) => {
  res.send('Welcome to API server!!').status(200).end()
})