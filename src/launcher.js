const { Mojang, Launch } = require('minecraft-java-core')
const unzip = require('extract-zip');
const fs = require('fs');
const javaSrc = require('.././config/javasrc.json') 
const path = require('path');
const launcherArgs = require('.././config/launcherargs.json')
const versionOpts  = require('.././config/versionopts.json') 
const semver = require('semver');

const parsedVersion = semver.coerce(versionOpts.versionNumber)

let targetJava = null;
if (semver.lte(parsedVersion, '1.16.5')) {
    targetJava = javaSrc.j8;
} else if(semver.lte(parsedVersion, '1.20.4') && semver.gt(parsedVersion, '1.16.5'))  {
    targetJava = javaSrc.j17;
} else {
    targetJava = javaSrc.j21;
}


if (!fs.existsSync(path.join(__dirname, targetJava.path))) {
    console.log('Java no existe.')

    downloadZip(targetJava.dw).then(async () => {
        await extractJava(path.join(__dirname, targetJava.path, `${targetJava.folder}.zip`));
        gameStart()
    })
} else {
    console.log('Java existe.')
    gameStart()
}

async function downloadZip(url) {
    console.log('Descargando java...')
    let targetPath = path.join(__dirname, targetJava.path, `${targetJava.folder}.zip`)

    if (!fs.existsSync(path.dirname(targetPath))) fs.mkdirSync(path.dirname(targetPath))

    let request = await fetch(url, { method: 'GET' })
    let buffer = await request.arrayBuffer()
    fs.writeFileSync(targetPath, new Uint8Array(buffer))
}

async function extractJava(zipPath) {
    console.log("Extrayendo Java...");
    await unzip(zipPath, { dir: path.join(__dirname, targetJava.path) });
    fs.rmSync(zipPath);
    console.log("Terminó de extraer!")
}


const launcher = new Launch();
async function gameStart() {
    var opts = {
        authenticator: await Mojang.login(launcherArgs.userName),
        version: versionOpts.versionNumber,
        memory: {
            max: launcherArgs.maxMem,
            min: launcherArgs.minMem
        },
        path: path.join(process.env.APPDATA, '/chmlch/minecraft'),
        java: {
            path: path.join(__dirname, targetJava.path, targetJava.folder, './bin/javaw.exe'),
            type: 'jre'
        },
        loader: versionOpts.loader,
        JVM_ARGS: [
            '-Dminecraft.api.auth.host=https://chimbaland.4.pronto/nunca_muere',
            '-Dminecraft.api.account.host=https://chimbaland.4.pronto/nunca_muere',
            '-Dminecraft.api.session.host=https://chimbaland.4.pronto/nunca_muere',
            "-Dminecraft.api.services.host=https://chimbaland.4.pronto/nunca_muere"
        ],
        instance: "Chimbaland3"
    }

    await launcher.Launch(opts)

    launcher.on('extract', extract => {
        console.log(extract);
    });

    launcher.on('progress', (progress, size, element) => {
        process.stdout.write(`Downloading ${element} ${Math.round((progress / size) * 100)}%\r`);
    });

    launcher.on('check', (progress, size, element) => {
        process.stdout.write(`Checking ${element} ${Math.round((progress / size) * 100)}%\r`);
    });

    launcher.on('estimated', (time) => {
        let hours = Math.floor(time / 3600);
        let minutes = Math.floor((time - hours * 3600) / 60);
        let seconds = Math.floor(time - hours * 3600 - minutes * 60);
        process.stdout.write(`${hours}h ${minutes}m ${seconds}s\r`);
    })

    launcher.on('speed', (speed) => {
        process.stdout.write(`${(speed / 1067008).toFixed(2)} Mb/s\r`)
    })

    launcher.on('patch', patch => {
        console.log(patch);
    });

    launcher.on('data', (e) => {
        console.log(e);
    })

    launcher.on('close', code => {
        console.log(code);
    });

    launcher.on('error', err => {
        console.log(err);
    });
}