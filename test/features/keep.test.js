const { i18n, loader } = require('presang')
const actions = require('../../lib/actions.js')
const locales = require('../../lib/locales.js')

describe('keep', () => {
  it('should keep result keys', async () => {
    const app = await loader({ path: 'test/apps/app13', locales })
    const $ = { app, params: { action: 'createProject' } }
    const result = await actions($)
    expect(result.evil).toBeUndefined()
    expect(result.something).toEqual(2)
    expect(result.other).toEqual(3)
  })

  it('should keep result keys as function', async () => {
    const app = await loader({ path: 'test/apps/app14', locales })
    const $ = { app, params: { action: 'createProject' } }
    const result = await actions($)
    expect(result.evil).toBeUndefined()
    expect(result.something).toEqual(2)
    expect(result.other).toEqual(3)
  })
})