const express = require('express')
const dotenv = require('dotenv')
const path = require('path')

dotenv.config({ path: path.join(__dirname, './.env') })

const PORT = process.env.PORT
const app = express()

app.use(express.json())
app.use((req, res, next) => {
  console.log(`${req.method} in ${req.path}`)
  next()
})

const DiscordRoutes = require('./routes/discord.routes')

app.use('/discord', DiscordRoutes)

app.listen(PORT, async () => {
  console.log('Listening on port ' + PORT)
})
