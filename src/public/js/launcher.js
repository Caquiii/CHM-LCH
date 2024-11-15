document.addEventListener('DOMContentLoaded', async () => {
  var userData = await window.discord.getUser()
  var _userImg = document.getElementById('_userImg')

  console.log(userData)
  const _launchBtn = document.getElementById('_launchBtn')
  _launchBtn.addEventListener('click', () => {
    window.launcher.launch()
  })

  _userImg.src = `https://cdn.discordapp.com/avatars/${userData.id}/${userData.avatar}`
})
