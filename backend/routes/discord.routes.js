const express = require('express')
const DiscordRoutes = express.Router()

const controllers = require('../controllers/discord.controller')

DiscordRoutes.get('/redirect', controllers.redirect)
DiscordRoutes.get('/callback', controllers.callback)

DiscordRoutes.get('/exchange_code', controllers.exchange)
DiscordRoutes.get('/refresh_token', controllers.refresh)
DiscordRoutes.get('/revoke_token', controllers.revoke)

module.exports = DiscordRoutes
