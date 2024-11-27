const { app } = require('electron')
const { Mojang, Launch } = require('minecraft-java-core')
const semver = require('semver')
const unzip = require('extract-zip')
const superagent = require('superagent')

const fs = require('fs')
const path = require('path')

const javaPath = path.join(app.getPath('userData'), './java/')
const javaOpts = {
  j21: {
    dw: 'https://builds.openlogic.com/downloadJDK/openlogic-openjdk-jre/21.0.5+11/openlogic-openjdk-jre-21.0.5+11-windows-x64.zip',
    path: path.join(javaPath, './java21/'),
    dir: 'openlogic-openjdk-jre-21.0.5+11-windows-x64',
  },
  j17: {
    dw: 'https://builds.openlogic.com/downloadJDK/openlogic-openjdk-jre/17.0.13+11/openlogic-openjdk-jre-17.0.13+11-windows-x64.zip',
    path: path.join(javaPath, './java17/'),
    dir: 'openlogic-openjdk-jre-17.0.13+11-windows-x64',
  },
  j8: {
    dw: 'https://builds.openlogic.com/downloadJDK/openlogic-openjdk-jre/8u432-b06/openlogic-openjdk-jre-8u432-b06-windows-x64.zip',
    path: path.join(javaPath, './java8/'),
    dir: 'openlogic-openjdk-jre-8u432-b06-windows-x64',
  },
}

class LauncherService {
  constructor() {
    this.launcher = new Launch()
    this.minecraftFolderPath = path.join(app.getPath('userData'), '/minecraft')

    if (!fs.existsSync(this.minecraftFolderPath)) {
      console.log(`-> Created folder at ${this.minecraftFolderPath}`)
      fs.mkdirSync(this.minecraftFolderPath)
    }

    this.launcher.on('extract', (extract) => {
      console.log(extract)
    })

    this.launcher.on('progress', (progress, size, element) => {
      console.log(`Downloading ${element} ${Math.round((progress / size) * 100)}%`)
    })

    this.launcher.on('check', (progress, size, element) => {
      console.log(`Checking ${element} ${Math.round((progress / size) * 100)}%`)
    })

    this.launcher.on('estimated', (time) => {
      let hours = Math.floor(time / 3600)
      let minutes = Math.floor((time - hours * 3600) / 60)
      let seconds = Math.floor(time - hours * 3600 - minutes * 60)
      console.log(`${hours}h ${minutes}m ${seconds}s`)
    })

    this.launcher.on('speed', (speed) => {
      console.log(`${(speed / 1067008).toFixed(2)} Mb/s`)
    })

    this.launcher.on('patch', (patch) => {
      console.log(patch)
    })

    this.launcher.on('data', (e) => {
      console.log(e)
    })

    this.launcher.on('close', (code) => {
      console.log(code)
    })

    this.launcher.on('error', (err) => {
      console.log(err)
    })
  }

  async downloadJava(version) {
    var parsedVersion = semver.coerce(version)
    var java = semver.lte(parsedVersion, '1.16.5')
      ? javaOpts.j8
      : semver.lte(parsedVersion, '1.20.4') && semver.gt(parsedVersion, '1.16.5')
      ? javaOpts.j17
      : javaOpts.j21

    var javaExecutablePath = path.join(java.path, java.dir, './bin/javaw.exe')
    if (fs.existsSync(javaExecutablePath)) {
      console.log('Java existe.')
      return java
    }

    return new Promise((resolve, reject) => {
      console.log('Descargando java...')
      const dest = path.join(app.getAppPath('temp'), './java.zip')
      const stream = fs.createWriteStream(dest)
      const pipe = superagent.get(java.dw).pipe(stream)

      pipe.on('finish', async () => {
        console.log('Extrayendo java...')
        await unzip(dest, { dir: java.path })
        fs.rmSync(dest)
        console.log('Se extrajo java!')
        resolve(java)
      })
    })
  }

  async downloadMods(url) {
    return new Promise((resolve, reject) => {
      console.log('Descargando mods...')

      const dest = path.join(app.getPath('temp'), './main.zip')
      const stream = fs.createWriteStream(dest)
      const pipe = superagent.get(url).pipe(stream)

      pipe.on('finish', async () => {
        console.log('Extrayendo mods...')

        const instancesPath = path.join(app.getPath('userData'), '/minecraft/instances/')
        await unzip(dest, { dir: instancesPath })
        fs.rmSync(dest)

        console.log('Se extrayeron los mods!')
        resolve()
      })
    })
  }

  async launch(modpackId) {
    const { API, Data } = require('./')

    var modpackData = await API.getModpackInfo(modpackId)
    var java = await this.downloadJava(modpackData.settings.version)
    await this.downloadMods(modpackData.mods)

    var launcherArgs = {
      authenticator: await Mojang.login(Data._data.launcherArgs.username),
      memory: Data._data.launcherArgs.memory,
    }

    var launcherOptions = {
      ...launcherArgs,
      ...modpackData.settings,
      path: path.join(app.getPath('userData'), '/minecraft'),
      java: {
        path: path.join(java.path, java.dir, './bin/javaw.exe'),
        type: 'jre',
      },
      JVM_ARGS: [
        '-Dminecraft.api.auth.host=https://chimbaland.4.pronto/nunca_muere',
        '-Dminecraft.api.account.host=https://chimbaland.4.pronto/nunca_muere',
        '-Dminecraft.api.session.host=https://chimbaland.4.pronto/nunca_muere',
        '-Dminecraft.api.services.host=https://chimbaland.4.pronto/nunca_muere',
      ],
    }

    await this.launcher.Launch(launcherOptions)
  }
}

module.exports = LauncherService
