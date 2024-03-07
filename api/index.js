import express from "express"

const PORT = 3333
const app = express()

app.listen(PORT, (req, res) => {
  console.log(`Server is running on port: ${PORT}`)
})
