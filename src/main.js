const { app } = require('electron')
const path = require('path')

const mc = require('./launcher.js')
var WindowsService = require('./Windows.js')
var windows = new WindowsService(path.join(__dirname, './client'))

app.once('ready', async () => {
    app.setName('CHM-LCH')
    ipcMain.handle('launcher:open', () => { mc.gameStart() })
    windows.createMainWindow()
})