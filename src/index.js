const Boom = require('boom')
const fetch = require('node-fetch')

module.exports = authUrl => async (ctx, next) => {
  if (!ctx.request.token) {
    ctx.request.session = {}
  } else {
    try {
      const resp = await fetch(authUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token: ctx.request.token }),
      })
      if (resp.status !== 200) throw new Error()
      ctx.request.session = await resp.json()
    } catch (err) {
      throw Boom.badGateway(`${authUrl} failed to resolve the session.`)
    }
  }
}
