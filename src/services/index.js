const path = require('path')

const WindowsService = require('./Windows.js')
const AuthenticationService = require('./Authentication.js')
const DiscordService = require('./Discord.js')
const LauncherService = require('./Launcher.js')

const htmlPath = path.join(__dirname, '../public')
const authUri = 'http://localhost:1313/'

module.exports = {
  Windows: new WindowsService(htmlPath),
  Authentication: new AuthenticationService(authUri),
  Discord: new DiscordService(),
  Launcher: new LauncherService(),
}
