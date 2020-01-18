const _ = require('lodash')
const loader = require('conficurse')
const LOCALES = require('./locales.js')

/** Load and configure app */
module.exports = async function(path = process.env.WAVEORB_APP || 'app') {
  const config = loader.load(`${path}/config`)
  const mail = loader.load(`${path}/mail`)
  const middleware = loader.load(`${path}/middleware`)
  const plugins = loader.load(`${path}/plugins`)
  let locales = loader.load(`${path}/locales`)
  locales = _.merge({}, LOCALES, locales)
  const filters = loader.load(`${path}/filters`, { merge: true })
  const routes = loader.load(`${path}/routes`, { merge: true })
  const layouts = loader.load(`${path}/layouts`)
  const pages = loader.load(`${path}/pages`)
  const app = { config, mail, middleware, plugins, locales, filters, routes, layouts, pages }
  for (const key in plugins) {
    if (typeof plugins[key] === 'function') {
      await plugins[key](app)
    }
  }
  return app
}
