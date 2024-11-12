const { contextBridge, ipcRenderer } = require('electron')

contextBridge.exposeInMainWorld('launcher', {
    open: () => ipcRenderer.invoke('launcher:open'),
  })