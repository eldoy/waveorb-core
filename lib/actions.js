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

  async function clean(result) {

    async function operation(type, want) {
      let list = action[type]
      if (_.isFunction(list)) {
        list = await list($)
      }
      if (list) {
        const items = _.isArray(result) ? result : [result]
        for (const obj of items) {
          if (_.isPlainObject(obj)) {
            for (const key in obj) {
              if (list.includes(key) === want) {
                delete obj[key]
              }
            }
          }
        }
        result = _.isArray(result) ? items : items[0]
      }
    }

    // Run remove
    await operation('remove', true)

    // Run keep
    await operation('keep', false)


    return result
  }

  if (action) {

    // Run filters
    let filters = action.filters
    if (_.isFunction(filters)) {
      filters = await filters($)
    }
    for (const name of filters || []) {
      const filterPath = `filters.${name}`.replace(/\//g, '.')
      const filter = _.get($.app, filterPath)
      if (await run(filter)) {
        return await clean($.result)
      }
    }

    // Run before
    if (await run(action.before)) {
      return await clean($.result)
    }

    // Run deny
    for (const key in action.deny) {
      const fields = $.params[key] || {}
      for (const name in fields) {
        let deny = action.deny[key]
        if (_.isFunction(deny)) {
          deny = await deny($)
        }
        if ((deny || []).includes(name)) {
          delete fields[name]
        }
      }
    }

    // Run allow
    for (const key in action.allow) {
      const fields = $.params[key] || {}
      for (const name in fields) {
        let allow = action.allow[key]
        if (_.isFunction(allow)) {
          allow = await allow($)
        }
        if (!(allow || []).includes(name)) {
          delete $.params[key][name]
        }
      }
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
      return await clean($.result)
    }

    // Run after
    await run(action.after)
  }

  return $.result || null
}
