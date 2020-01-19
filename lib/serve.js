const _ = require('lodash')
const Sirloin = require('sirloin')
const { markup, i18n, route, tools, dispatch } = require('presang')
const router = require('./router.js')
const PORT = parseInt(process.env.WAVEORB_PORT || 5000)
const HOST = process.env.WAVEORB_HOST

module.exports = async function(app) {
  // Uncomment to inspect app
  // tools.inspect(app)
  console.log(`MODE: ${process.env.NODE_ENV}`)
  const defaultLang = process.env.WAVEORB_LANG || _.get(app, 'config.env.lang') || 'en'
  const routeOptions = _.get(app, 'config.routes') || {}
  const serverOptions = { port: PORT, host: HOST, files: 'app/assets' }
  const cert = process.env.WAVEORB_SSL_CERT
  const key = process.env.WAVEORB_SSL_KEY
  if (cert && key) {
    console.log(`Using cert ${cert}`)
    console.log(`Using key ${key}`)
    serverOptions.ssl = { key, cert }
  }
  const server = new Sirloin(serverOptions)

  /** Apply middleware */
  for (const m in app.middleware) {
    const fn = app.middleware[m]
    typeof fn === 'function' && server.use(fn)
  }

  // Markup requests
  server.get('*', async function(req, res) {
    if (!(/\.html$/).test(req.pathname) && !req.pathname.endsWith('/')) return
    const params = {}
    const client = { query: req.query, req, res, server }
    const $ = route(app, params, client, tools, defaultLang)
    const fn = markup(req, res, routeOptions)
    return dispatch($, fn)
  })

  // Websocket requests
  server.action('*', async function(params, client) {
    tools.transform(params)
    client = { socket: client, server }
    const $ = route(app, params, client, tools, defaultLang)
    return dispatch($, router)
  })

  // HTTP requests
  server.post('*', async function(req, res) {
    const { params, files, query } = req
    tools.transform(params)
    const client = { files, query, req, res, server }
    const $ = route(app, params, client, tools, defaultLang)
    return dispatch($, router)
  })
}
