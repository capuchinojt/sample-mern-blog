import express from "express"
import 'dotenv/config'
import "./dbs/init.database.js"

const PORT = process.env.PORT || 9999
const app = express()

app.listen(PORT, (req, res) => {
  console.log(`Server is running on port: ${PORT}`)
})
