const { i18n, loader } = require('presang')
const actions = require('../../lib/actions.js')
const locales = require('../../lib/locales.js')

describe('remove', () => {
  it('should remove result keys', async () => {
    const app = await loader({ path: 'test/apps/app15', locales })
    const $ = { app, params: { action: 'createProject' } }
    const result = await actions($)
    expect(result.evil).toBeUndefined()
    expect(result.something).toEqual(2)
    expect(result.other).toEqual(3)
  })

  it('should remove result keys as function', async () => {
    const app = await loader({ path: 'test/apps/app16', locales })
    const $ = { app, params: { action: 'createProject' } }
    const result = await actions($)
    expect(result.evil).toBeUndefined()
    expect(result.something).toEqual(2)
    expect(result.other).toEqual(3)
  })
})