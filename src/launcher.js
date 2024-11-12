const { MinecraftLauncher } = require('minecraft-launcher-js');
const wget = require('wget-improved');
const unzip = require('extract-zip');
const fs = require('fs');
const javaSrc = require('.././config/javasrc.json');
const path = require('path');
const launcherArgs = require('.././config/launcherargs.json');
const versionOpts = require('.././config/versionopts.json');
//const { Auth } = require('msmc');

const semver = require('semver')
const parsedVersion = semver.coerce(versionOpts.versionNumber)

let targetJava = null;
if (semver.lte(parsedVersion, '1.16.5')) {
    targetJava = javaSrc.j8;
} else if(semver.lte(parsedVersion, '1.20.4') && semver.gt(parsedVersion, '1.16.5'))  {
    targetJava = javaSrc.j17;
} else {
    targetJava = javaSrc.j21;
} 

downloadZip(targetJava.dw)
.then(async () => {
    await extractJava(path.join(__dirname, targetJava.path, `${targetJava.folder}.zip`));
    gameStart()
})

async function downloadZip(url) {
    let targetPath = path.join(__dirname, targetJava.path, `${targetJava.folder}.zip`)

    if (!fs.existsSync(path.dirname(targetPath))) fs.mkdirSync(path.dirname(targetPath))

    let request = await fetch(url, { method: 'GET' })
    let buffer = await request.arrayBuffer()
    fs.writeFileSync(targetPath, new Uint8Array(buffer))
}

/* TODO:
javaDownload.on('progress', function(progress) {
    typeof progress === 'number'
}); */

async function extractJava(zipPath) {
    console.log("Extrayendo Java...");
    await unzip(zipPath, { dir: path.join(__dirname, targetJava.path) });
    fs.rmSync(zipPath);
    console.log("Terminó de extraer!")
}


const launcher = new MinecraftLauncher({

    authentication: {
        name: launcherArgs.userName
    },
    memory: {
        max: launcherArgs.maxMem,
        min: launcherArgs.minMem
    },
    version: {
        number: versionOpts.versionNumber,
        type: versionOpts.versionType
    },
    gameRoot: path.join(process.env.APPDATA, '/chmlch/minecraft'),
    javaPath: path.join(__dirname, targetJava.path, targetJava.folder, './bin/javaw.exe')

});

async function gameStart() {
    
    launcher.on('download_start', (e) => {
        console.log(
          `Descargando: ${e.files}, ${e.totalSize / 1024} KB`,
        );
      });

    launcher.on('download_progress', (e) => {
        console.log(`Progreso: ${e.progress}% | Archivo ${e.progressFiles} de ${e.totalFiles} | Tamaño ${(e.progressSize / 1024).toFixed(0)}KB / ${(e.totalSize / 1024).toFixed(0)}KB`);
    });
    
    launcher.on('download_end', (e) => {
        console.log(`Terminado: error=${e.error},task=${e.name}`);
    });

    launcher.prepare();

    await launcher.download();
    
    await launcher.start();
}

module.exports = {
    gameStart
}