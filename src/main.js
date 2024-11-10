const { MinecraftLauncher } = require('minecraft-launcher-js');
//const { Auth } = require('msmc');

const launcher = new MinecraftLauncher({

    authentication: {
        name: "NegroMiguel"
    },
    memory: {
        max: 2048,
        min: 1024
    },
    version: {
        number: "1.21.3",
        type: "release"
    },
    gameRoot: "./game/minecraft"

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

gameStart();