document.addEventListener('DOMContentLoaded', async () => {
  var userData = await window.discord.getUser()
  var _userImg = document.getElementById('_userImg')

  console.log(userData)

  _userImg.src = `https://cdn.discordapp.com/avatars/${userData.id}/${userData.avatar}`
})
