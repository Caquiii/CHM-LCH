const superagent = require('superagent')
const url = require('url')

const ModpackModel = require('../models/modpack.model')

module.exports.getModpack = async function (req, res) {
  try {
    const { modpackId } = req.params
    if (!modpackId) return res.sendStatus(404)
    const modpack = await ModpackModel.findById(modpackId)
    if (!modpack) return res.sendStatus(404)
    res.send(modpack.toJSON())
  } catch (error) {
    res.status(500).send(error)
  }
}
