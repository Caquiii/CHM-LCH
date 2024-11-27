const { app } = require('electron')

const { Windows, API, Discord } = require('./services')

app.once('ready', async () => {
  Windows.createMainWindow()
  require('./handles.js')

  const { access_token, refresh_token } = await Discord.getAuthData()

  if (!access_token || !refresh_token) {
    return console.log('No access_token or refresh_token, prompt login!')
  }

  var authData = await API.refresh_token(refresh_token)
  if (!authData.access_token) {
    return console.log('No access_token or refresh_token, prompt login!')
  }

  Windows.mainWindow.loadFile(Windows.viewsPath + '/launcher.html')
  await Discord.saveAuthData(authData)
})
