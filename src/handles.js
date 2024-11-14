const { ipcMain } = require('electron')
const { Windows, Authentication, Discord } = require('./services')

ipcMain.handle('app:discordLogin', () => {
  var discWin = Windows.createModalWindow({
    width: 510,
    height: 700,
    resizable: false,
  })

  discWin.removeMenu()
  discWin.loadURL(Authentication.ApiUri + 'discord/redirect')

  discWin.webContents.session.webRequest.onBeforeRequest((details, callback) => {
    if (details.url.includes('/auth/conditional/start')) {
      console.log('Blocked', details.url)
    } else {
      callback({})
    }
  })

  discWin.webContents.on('will-navigate', async (ev, url) => {
    var queryParams = new URL(url).searchParams
    var code = queryParams.get('code')

    var authData = await Authentication.exchange_code(code)
    await Discord.saveAuthData(authData)

    discWin.close()
    discWin.getParentWindow().webContents.send('discordWindowLogin')
  })
})

ipcMain.handle('discord:getUser', async () => {
  return await Discord.getUserData()
})
