const { app } = require('electron')

const { Windows } = require('./services')

app.once('ready', async () => {
  Windows.createMainWindow()
  require('./handles.js')
})
