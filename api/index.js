import express from "express"
import 'dotenv/config'

import "./dbs/init.database.js"
import userRoutes from './routes/user.route.js'
import authRoutes from './routes/auth.route.js'

const PORT = process.env.PORT || 9999
const app = express()
app.use(express.json())

app.listen(PORT, () => {
  console.log(`Server is running on port: ${PORT}`)
})

app.use('/api/v1/user', userRoutes)
app.use('/api/auth', authRoutes)

app.use('/', (req, res) => {
  res.send('Welcome to API server!!').status(200).end()
})