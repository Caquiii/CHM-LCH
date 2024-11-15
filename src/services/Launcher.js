const { app } = require('electron')
const { Mojang, Launch } = require('minecraft-java-core')
const semver = require('semver')
const unzip = require('extract-zip')

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

const dummyOptions = {
  instance: 'Chimba3',
  versionNumber: '1.16.5',
  loader: {
    path: '',
    type: 'forge',
    build: 'latest',
    enable: true,
  },
}

const dummyArgs = {
  maxMem: '4096m',
  minMem: '1024m',
  userName: 'NegroMiguel',
}

class LauncherService {
  constructor() {
    this.modpack = dummyOptions
    this.targetJava = null
    this.parsedVersion = semver.coerce(this.modpack.versionNumber)
    this.lonchera = new Launch()

    if (semver.lte(this.parsedVersion, '1.16.5')) {
      this.targetJava = javaOpts.j8
    } else if (semver.lte(this.parsedVersion, '1.20.4') && semver.gt(this.parsedVersion, '1.16.5')) {
      this.targetJava = javaOpts.j17
    } else {
      this.targetJava = javaOpts.j21
    }
  }

  async launch() {
    if (!fs.existsSync(path.join(app.getPath('userData'), '/minecraft'))) {
      fs.mkdirSync(path.join(app.getPath('userData'), '/minecraft'))
    }

    await this.lonchera.Launch({
      authenticator: await Mojang.login(dummyArgs.userName),
      version: dummyOptions.versionNumber,
      memory: {
        max: dummyArgs.maxMem,
        min: dummyArgs.minMem,
      },
      path: path.join(app.getPath('userData'), '/minecraft'),
      java: {
        path: path.join(this.targetJava.path, this.targetJava.dir, './bin/javaw.exe'),
        type: 'jre',
      },
      loader: dummyOptions.loader,
      JVM_ARGS: [
        '-Dminecraft.api.auth.host=https://chimbaland.4.pronto/nunca_muere',
        '-Dminecraft.api.account.host=https://chimbaland.4.pronto/nunca_muere',
        '-Dminecraft.api.session.host=https://chimbaland.4.pronto/nunca_muere',
        '-Dminecraft.api.services.host=https://chimbaland.4.pronto/nunca_muere',
      ],
      instance: dummyOptions.instance,
    })

    this.lonchera.on('extract', (extract) => {
      console.log(extract)
    })

    this.lonchera.on('progress', (progress, size, element) => {
      process.stdout.write(`Downloading ${element} ${Math.round((progress / size) * 100)}%\r`)
    })

    this.lonchera.on('check', (progress, size, element) => {
      process.stdout.write(`Checking ${element} ${Math.round((progress / size) * 100)}%\r`)
    })

    this.lonchera.on('estimated', (time) => {
      let hours = Math.floor(time / 3600)
      let minutes = Math.floor((time - hours * 3600) / 60)
      let seconds = Math.floor(time - hours * 3600 - minutes * 60)
      process.stdout.write(`${hours}h ${minutes}m ${seconds}s\r`)
    })

    this.lonchera.on('speed', (speed) => {
      process.stdout.write(`${(speed / 1067008).toFixed(2)} Mb/s\r`)
    })

    this.lonchera.on('patch', (patch) => {
      console.log(patch)
    })

    this.lonchera.on('data', (e) => {
      console.log(e)
    })

    this.lonchera.on('close', (code) => {
      console.log(code)
    })

    this.lonchera.on('error', (err) => {
      console.log(err)
    })
  }

  async downloadZip() {
    console.log('Descargando java...')
    var targetPath = path.join(this.targetJava.path, 'java.zip')

    if (!fs.existsSync(this.targetJava.path)) {
      fs.mkdirSync(path.dirname(this.targetJava.path))
    }

    if (!fs.existsSync(path.dirname(targetPath))) {
      fs.mkdirSync(path.dirname(targetPath))
    }

    let request = await fetch(this.targetJava.dw, { method: 'GET' })
    let buffer = await request.arrayBuffer()
    fs.writeFileSync(targetPath, new Uint8Array(buffer))

    console.log('Terminó de descargar!')
  }

  async extractJava() {
    console.log('Extrayendo Java...')

    var targetPath = path.join(this.targetJava.path, 'java.zip')
    await unzip(targetPath, { dir: this.targetJava.path })
    fs.rmSync(targetPath)

    console.log('Terminó de extraer!')
  }

  async checkJava() {
    if (!fs.existsSync(this.targetJava.path)) {
      console.log('Java no existe.')
      this.downloadZip().then(async () => {
        await this.extractJava()
        await this.launch()
      })
    } else {
      console.log('Java existe.')
      await this.launch()
    }
  }
}

module.exports = LauncherService
