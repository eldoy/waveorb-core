const _ = require('lodash')
const Sirloin = require('sirloin')
const { markup, i18n, orb, tools, dispatch } = require('presang')
const actions = require('./actions.js')
const PORT = parseInt(process.env.WAVEORB_PORT || 5000)
const HOST = process.env.WAVEORB_HOST

module.exports = async function(app) {
  // Uncomment to inspect app
  // tools.inspect(app)
  console.log(`Mode: ${process.env.NODE_ENV}`)
  const serverOptions = { port: PORT, host: HOST, files: 'app/assets' }
  const cert = process.env.WAVEORB_SSL_CERT
  const key = process.env.WAVEORB_SSL_KEY
  if (cert && key) {
    console.log(`Using cert ${cert}`)
    console.log(`Using key ${key}`)
    serverOptions.ssl = { key, cert }
  }
  const server = new Sirloin(serverOptions)

  // Markup requests
  server.get('*', async function(req, res) {
    if (!(/\.html$/).test(req.pathname) && !req.pathname.endsWith('/')) return
    const params = {}
    const client = { query: req.query, req, res, server }
    const $ = orb(app, params, client, tools)
    return dispatch($, markup)
  })

  // Websocket requests
  server.action('*', async function(params, client) {
    tools.transform(params)
    client = { socket: client, server }
    const $ = orb(app, params, client, tools)
    return dispatch($, actions)
  })

  // HTTP requests
  server.post('*', async function(req, res) {
    const { params, files, query } = req
    tools.transform(params)
    const client = { files, query, req, res, server }
    const $ = orb(app, params, client, tools)
    return dispatch($, actions)
  })
}
