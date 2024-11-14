const { app, ipcMain, BrowserWindow } = require('electron')
const path = require('path')

const WindowsService = require('./Windows')
const Services = {
  Windows: new WindowsService(path.join(__dirname, './client')),
}

app.once('ready', async () => {
  const { Windows } = Services
  Windows.createMainWindow()

  ipcMain.handle('app:discordLogin', () => {
    var discWin = Windows.createWindow({
      parent: Windows.mainWindow,
      width: 510,
      height: 700,
      // resizable: false
      // frame: false,
    })

    // discWin.removeMenu()

    discWin.loadURL(
      'https://discord.com/oauth2/authorize?client_id=1305752438078181476&response_type=code&redirect_uri=http%3A%2F%2Flocalhost%3A1313%2Fdiscord&scope=identify'
    )
  })

  // require('./backend/server')
})
