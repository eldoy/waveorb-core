const _ = require('lodash')
const validate = require('./validate.js')

module.exports = async function($) {
  async function run(fn) {
    if (_.isFunction(fn)) {
      const result = await fn($)
      return result && ($.result = result)
    }
  }
  const action = _.get($.app, `actions.${$.params.path}`)
  if (action) {
    for (const name of action.filters || []) {
      const filter = _.get($.app, `filters.${name}`)
      if (await run(filter)) {
        return $.result
      }
    }

    if (await run(action.before)) {
      return $.result
    }

    const issues = {}
    for (const key in action.validate) {
      const spec = _.get(action.validate, key)
      const data = _.get($.params, key)
      const fields = await validate(spec, data, $)
      if (fields) {
        issues[key] = fields
      }
    }

    if (!_.isEmpty(issues)) {
      return { error: { message: $.t('validation.error'), ...issues } }
    }

    if (await run(action.main)) {
      return $.result
    }
    await run(action.after)
  }
  return $.result || null
}
