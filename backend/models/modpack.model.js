const mongoose = require('mongoose')

var modpackDef = {
  mods: String,
  settings: {
    instance: String,
    version: String,
    loader: {
      path: { type: String, default: '' },
      type: { type: String, default: 'forge' },
      build: { type: String, default: 'latest' },
      enable: { type: Boolean, default: true },
    },
  },
}

var modpack = new mongoose.Schema(modpackDef)

module.exports = mongoose.model('Modpack', modpack)
