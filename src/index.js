const Boom = require('boom')
const fetch = require('node-fetch')

module.exports = authUrl => async (ctx, next) => {
  if (!ctx.request.token) {
    ctx.request.session = {}
  } else {

    const resp = await fetch(authUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ token: ctx.request.token }),
    })
    
    if(resp.status === 401) 
      throw Boom.unauthorized()
    if(resp.status !== 200) 
      throw Boom.badGateway(`Authenticator ${authUrl} failed to resolve the session.`)

    ctx.request.session = await resp.json()
  }

  return next()
}
