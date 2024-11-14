const { contextBridge, ipcRenderer } = require('electron')

contextBridge.exposeInMainWorld('app', {
  promptDiscordLogin: () => ipcRenderer.invoke('app:discordLogin'),
})
