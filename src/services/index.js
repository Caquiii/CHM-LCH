const { app } = require('electron')
const path = require('path')

const WindowsService = require('./Windows.js')
const ApiService = require('./Api.js')
const DiscordService = require('./Discord.js')
const LauncherService = require('./Launcher.js')
const DataService = require('./Data.js')

const htmlPath = path.join(__dirname, '../public')
const dataPath = path.join(app.getPath('userData'), '/data.json')
const authUri = 'http://localhost:1313/'

module.exports = {
  Windows: new WindowsService(htmlPath),
  API: new ApiService(authUri),
  Discord: new DiscordService(),
  Launcher: new LauncherService(),
  Data: new DataService(dataPath),
}
