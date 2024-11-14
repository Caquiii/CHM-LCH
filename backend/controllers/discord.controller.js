const superagent = require('superagent')
const url = require('url')

const REDIRECT_URI = encodeURIComponent('http://localhost:1313/discord/callback')
const AUTH_URL = `https://discord.com/api/oauth2/authorize?client_id=${process.env.CLIENT_ID}&redirect_uri=${REDIRECT_URI}&response_type=code&scope=identify`
const AUTH_TOKEN = Buffer.from(`${process.env.CLIENT_ID}:${process.env.CLIENT_SECRET}`).toString('base64')

module.exports.callback = async function (req, res) {
  res.sendStatus(200)
}

module.exports.redirect = async function (req, res) {
  res.redirect(AUTH_URL)
}

module.exports.exchange = async function (req, res) {
  var exchangeRes = await superagent
    .post('https://discord.com/api/v10/oauth2/token')
    .set('Content-Type', 'application/x-www-form-urlencoded')
    .set('Authorization', `Basic ${AUTH_TOKEN}`)
    .send({
      grant_type: 'authorization_code',
      code: req.query.code,
      redirect_uri: url.format({
        protocol: req.protocol,
        host: req.get('host'),
        pathname: req.baseUrl + '/callback',
      }),
    })
    .ok((res) => res.status < 500)
    .catch((err) => console.log(err))

  if (exchangeRes.status != 200) {
    return res.status(401).send(exchangeRes.body)
  }

  res.send(exchangeRes.body)
}

module.exports.refresh = async function (req, res) {
  var refreshRes = await superagent
    .post('https://discord.com/api/v10/oauth2/token')
    .set('Content-Type', 'application/x-www-form-urlencoded')
    .set('Authorization', `Basic ${AUTH_TOKEN}`)
    .send({
      grant_type: 'refresh_token',
      refresh_token: req.query.refresh_token,
    })
    .ok((res) => res.status < 500)
    .catch((err) => console.log(err))

  if (refreshRes.status != 200) {
    return res.status(401).send(refreshRes.body)
  }

  res.send(refreshRes.body)
}

module.exports.revoke = async function (req, res) {
  var revokeRes = await superagent
    .post('https://discord.com/api/v10/oauth2/token/revoke')
    .set('Content-Type', 'application/x-www-form-urlencoded')
    .set('Authorization', `Basic ${AUTH_TOKEN}`)
    .send({
      token: req.query.access_token,
    })
    .ok((res) => res.status < 500)
    .catch((err) => console.log(err))

  if (revokeRes.status != 200) {
    return res.status(401).send(revokeRes.body)
  }

  res.send(revokeRes.body)
}
