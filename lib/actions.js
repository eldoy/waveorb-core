const _ = require('lodash')
const validate = require('./validate.js')

module.exports = async function($) {
  async function run(fn) {
    if (_.isFunction(fn)) {
      const result = await fn($)
      return result && ($.result = result)
    }
  }

  const actionPath = `actions.${$.params.action}`.replace(/\//g, '.')
  const action = _.get($.app, actionPath)
  if (action) {

    // Run filters
    for (const name of action.filters || []) {
      const filterPath = `filters.${name}`.replace(/\//g, '.')
      const filter = _.get($.app, filterPath)
      if (await run(filter)) {
        return $.result
      }
    }

    // Run before
    if (await run(action.before)) {
      return $.result
    }

    // Run deny
    for (const key in action.deny) {
      Object.keys($.params[key]).forEach(name => {
        if (action.deny[key].includes(name)) {
          delete $.params[key][name]
        }
      })
    }

    // Run allow
    for (const key in action.allow) {
      Object.keys($.params[key]).forEach(name => {
        if (!action.allow[key].includes(name)) {
          delete $.params[key][name]
        }
      })
    }

    // Validate
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
      return { error: { message: $.t('validation.error') }, ...issues }
    }

    // Run main
    if (await run(action.main)) {
      return $.result
    }

    // Run after
    await run(action.after)
  }

  return $.result || null
}
