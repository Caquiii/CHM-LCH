const { Client } = require('minecraft-launcher-core');
const { Auth } = require('msmc');

const launcher = new Client();

let opts = {
    root: "./minecraft",
    version: {
        number: "1.20.1",
        type: "release"
    },
    memory: {
        min: "1G",
        max: "2G"        
    }
}

launcher.launch(opts);

launcher.on('debug', (e) => console.log(e));
launcher.on('data', (e) => console.log(e));