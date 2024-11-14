const _discordBtn = document.getElementById('_discordBtn')
_discordBtn.addEventListener('click', () => window.discord.promptLogin())

window.discord.handleLogin(async () => {
  var body = JSON.stringify(await window.discord.getUser(), 0, 3)
  console.log(body)
})
