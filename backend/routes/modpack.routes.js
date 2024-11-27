const express = require('express')
const ModpackRoutes = express.Router()

const controllers = require('../controllers/modpack.controller')

// ModpackRoutes.get('/redirect', controllers.redirect)
ModpackRoutes.get('/:modpackId', controllers.getModpack)

module.exports = ModpackRoutes
