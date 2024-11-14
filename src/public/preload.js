const { contextBridge, ipcRenderer } = require('electron')

contextBridge.exposeInMainWorld('discord', {
  getUser: () => ipcRenderer.invoke('discord:getUser'),
})

contextBridge.exposeInMainWorld('app', {
  promptDiscordLogin: () => ipcRenderer.invoke('app:discordLogin'),
  handleDiscordLogin: (cb) => ipcRenderer.on('discordWindowLogin', cb),
})
