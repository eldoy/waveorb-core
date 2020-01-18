const _ = require('lodash')
const validate = require('./validate.js')

module.exports = async function($) {
  async function run(fn) {
    if (_.isFunction(fn)) {
      const result = await fn($)
      return result && ($.result = result)
    }
  }
  const route = _.get($.app, `routes.${$.params.path}`)
  if (route) {
    for (const name of route.filters || []) {
      const filter = _.get($.app, `filters.${name}`)
      if (await run(filter)) {
        return $.result
      }
    }

    if (await run(route.before)) {
      return $.result
    }

    const issues = {}
    for (const key in route.validate) {
      const spec = _.get(route.validate, key)
      const data = _.get($.params, key)
      const fields = await validate(spec, data, $)
      if (fields) {
        issues[key] = fields
      }
    }

    if (!_.isEmpty(issues)) {
      return { error: { message: $.t('validation_failed'), ...issues } }
    }

    if (await run(route.main)) {
      return $.result
    }
    await run(route.after)
  }
  return $.result || null
}
