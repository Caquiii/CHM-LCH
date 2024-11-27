document.addEventListener('DOMContentLoaded', async () => {
  var currentModpack = '673aae0042b9e9f451b28dc1'
  var userData = await window.discord.getUser()
  var _userImg = document.getElementById('_userImg')

  console.log(userData)
  // const _launchBtn = document.getElementById('_launchBtn')
  // _launchBtn.addEventListener('click', () => {
  //   window.launcher.launch(currentModpack)
  // })

  _userImg.src = `https://cdn.discordapp.com/avatars/${userData.id}/${userData.avatar}`
  _userImg.addEventListener('click', async () => {
    console.log('Clicked avatar')
  })
})
