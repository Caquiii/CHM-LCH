const superagent = require('superagent')
const keytar = require('keytar')

class DiscordService {
  constructor() {
    this.ApiUri = 'https://discord.com/api/v10/'
  }

  async getUserData() {
    var endpoint = this.ApiUri + 'users/@me'
    var token = await keytar.getPassword('CHM_DISCORD', 'access_token')
    var response = await superagent
      .get(endpoint)
      .set('Authorization', `Bearer ${token}`)
      .ok((res) => res.status < 500)
      .catch((err) => console.log(err))

    return response.body
  }
}

module.exports = DiscordService
