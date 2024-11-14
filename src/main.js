const { app } = require('electron')

const { Windows, Authentication, Discord } = require('./services')

app.once('ready', async () => {
  Windows.createMainWindow()
  require('./handles.js')

  const { access_token, refresh_token } = await Discord.getAuthData()

  if (!access_token || !refresh_token) {
    return console.log('No access_token or refresh_token, prompt login!')
  }

  var authData = await Authentication.refresh_token(refresh_token)
  if (!authData.access_token) {
    return console.log('No access_token or refresh_token, prompt login!')
  }

  await Discord.saveAuthData(authData)
})
