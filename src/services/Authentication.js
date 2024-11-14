const superagent = require('superagent')

class AuthenticationService {
  constructor(uri) {
    this.ApiUri = uri
  }

  async exchange_code(code) {
    var endpoint = this.ApiUri + 'discord/exchange_code'
    var response = await superagent
      .get(endpoint)
      .query({ code })
      .ok((res) => res.status < 500)
      .catch((err) => console.log(err))

    if (response.status == 200) {
      return response.body
    }
  }

  async refresh_token(refresh_token) {
    var endpoint = this.ApiUri + 'discord/refresh_token'
    var response = await superagent
      .get(endpoint)
      .query({ refresh_token })
      .ok((res) => res.status < 500)
      .catch((err) => console.log(err))
    return response.body
  }

  async revoke_token(access_token) {
    var endpoint = this.ApiUri + 'discord/revoke_token'
    var response = await superagent
      .get(endpoint)
      .query({ access_token })
      .ok((res) => res.status < 500)
      .catch((err) => console.log(err))
    return response.body
  }
}

module.exports = AuthenticationService
