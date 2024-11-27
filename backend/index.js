const express = require('express')
const dotenv = require('dotenv')
const mongoose = require('mongoose')

const path = require('path')

dotenv.config({ path: path.join(__dirname, './.env') })

const PORT = process.env.PORT
const MONGO_URL = process.env.MODE_ENV == 'production' ? process.env.PROD_URL : process.env.TEST_URL

const app = express()

app.use(express.json())
app.use((req, res, next) => {
  console.log(`${req.method} in ${req.path}`)
  next()
})

const DiscordRoutes = require('./routes/discord.routes')
const ModpackRoutes = require('./routes/modpack.routes')

app.use('/discord', DiscordRoutes)
app.use('/modpack', ModpackRoutes)

mongoose
  .connect(MONGO_URL)
  .then(() => console.log('Connected to mongo server'))
  .then(() => app.listen(PORT))
  .then(() => console.log('Listening on port %d', PORT))
  .catch((err) => {
    throw err
  })
