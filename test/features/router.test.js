const { i18n, loader } = require('presang')
const router = require('../../lib/router.js')
const locales = require('../../lib/locales.js')

describe('router', () => {
  it('should be a function', async () => {
    expect(typeof router).toBe('function')
  })

  it('should match the route main function', async () => {
    const app = await loader({ path: 'test/apps/app2', locales })
    const $ = { app, params: { path: 'createProject' } }
    const result = await router($)
    expect(result.hello).toBe('bye')
  })

  it('should match the route before function', async () => {
    const app = await loader({ path: 'test/apps/app3', locales })
    const $ = { app, params: { path: 'createProject' } }
    const result = await router($)
    expect(result.hello).toBe('bye')
  })

  it('should match the route after function', async () => {
    const app = await loader({ path: 'test/apps/app4', locales })
    const $ = { app, params: { path: 'createProject' } }
    const result = await router($)
    expect(result.hello).toBe('bye')
  })

  it('should curry function result1', async () => {
    const app = await loader({ path: 'test/apps/app5', locales })
    const $ = { app, params: { path: 'createProject' } }
    const result = await router($)
    expect(result.hello).toBe('before')
  })

  it('should curry function result2', async () => {
    const app = await loader({ path: 'test/apps/app5', locales })
    const $ = { app, params: { path: 'updateProject' } }
    const result = await router($)
    expect(result.hello).toBe('main')
  })

  it('should run filters', async () => {
    const app = await loader({ path: 'test/apps/app6', locales })
    const $ = { app, params: { path: 'createProject' } }
    const result = await router($)
    expect(result.hello).toBe('bye')
  })

  it('should validate data', async () => {
    const app = await loader({ path: 'test/apps/app7', locales })
    const $ = {
      app,
      params: {
        path: 'createProject',
        data: {
          name: 'hey'
        }
      },
      t: i18n.t({ locales })
    }
    let result = await router($)
    expect(result.error.message).toBe('validation failed')
    expect(result.error.data.name).toEqual([ 'minimum length is 5' ])

    $.params.data.name = 'hello'
    result = await router($)
    expect(result.hello).toBe('bye')
  })

  it('should match request pathname', async () => {
    const app = await loader({ path: 'test/apps/app7', locales })
    const $ = { app, params: { path: 'createProject'} }
    let result = await router($)
    expect(result.hello).toBe('bye')
  })
})
