const { loader } = require('presang')
const locales = require('./lib/locales.js')
const serve = require('./lib/serve.js')
const package = require('./package.json')
console.log(`${package.name} ${package.version}`)
if (!process.env.NODE_ENV) {
  process.env.NODE_ENV = 'development'
}
(async function() { serve(await loader({ locales })) }())
