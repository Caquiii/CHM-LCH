// https://github.com/Jleguim/briggs-video-compressor/blob/main/src/Services/SettingsService.js

const { ipcMain } = require('electron')
const fs = require('fs')

class DataService {
  constructor(DATA_PATH) {
    if (!fs.existsSync(DATA_PATH)) {
      fs.writeFileSync(DATA_PATH, JSON.stringify({}))
    }

    this.save_path = DATA_PATH
    this._data = {
      modpackIds: [],
      lastModpack: '',
      launcherArgs: {
        memory: {
          max: '4096m',
          min: '1024m',
        },
        username: 'Steve',
      },
    }

    ipcMain.handle('data:get', () => this._data)
    ipcMain.handle('data:set', (e, newData) => this.set(newData))
  }

  set(newObj) {
    let mutableKeys = Object.keys(newObj).filter((k) => Object.keys(this._data).includes(k))
    mutableKeys.forEach((key) => {
      this._data[key] = newObj[key]
    })
    this.save()
  }

  save() {
    let data = JSON.stringify(this._data, 0, 3)
    fs.writeFileSync(this.save_path, data)
    return this._data
  }

  load() {
    if (!fs.existsSync(this.save_path)) return this.save()
    let data = fs.readFileSync(this.save_path)
    let obj = JSON.parse(data)
    this.set(obj)
    return this._data
  }
}

module.exports = DataService
