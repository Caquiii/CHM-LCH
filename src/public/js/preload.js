const { contextBridge, ipcRenderer } = require('electron')

contextBridge.exposeInMainWorld('launcher', {
  launch: (currentModpack) => ipcRenderer.invoke('launcher:launch', currentModpack),
})

contextBridge.exposeInMainWorld('discord', {
  getUser: () => ipcRenderer.invoke('discord:getUser'),
  promptLogin: () => ipcRenderer.invoke('discord:promptLogin'),
  handleLogin: (cb) => ipcRenderer.on('discord:handleLogin', cb),
})

contextBridge.exposeInMainWorld('app', {
  close: () => ipcRenderer.invoke('app:close'),
  minimize: () => ipcRenderer.invoke('app:minimize'),
  maximize: () => ipcRenderer.invoke('app:maximize'),
})
