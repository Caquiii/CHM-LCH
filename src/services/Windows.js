//** https://github.com/Jleguim/briggs-video-compressor/blob/main/src/Services/WindowsService.js */
const { BrowserWindow } = require('electron')
const path = require('path')

class WindowsService {
  constructor(viewsPath) {
    this.viewsPath = viewsPath
    this.mainWindow = null
    this.windowSettings = {
      title: 'CHM-LCH',
      width: 986,
      height: 740,
      autoHideMenuBar: true,
      resizable: false,
      show: false,
      frame: false,
      transparent: true,
      webPreferences: { preload: path.resolve(this.viewsPath, './js/preload.js') },
    }
  }

  createMainWindow() {
    let mainWindowFile = path.resolve(this.viewsPath, 'index.html')
    let mainWindow = this.createWindow(this.windowSettings)

    this.mainWindow = mainWindow
    this.mainWindow.loadFile(mainWindowFile)

    return this.mainWindow
  }

  createWindow(options) {
    options = Object.assign(options, { show: false })
    var win = new BrowserWindow(options)

    win.on('ready-to-show', () => win.show())

    return win
  }

  createModalWindow(options) {
    options = Object.assign(options, { parent: this.mainWindow, modal: true })
    return this.createWindow(options)
  }
}

module.exports = WindowsService
