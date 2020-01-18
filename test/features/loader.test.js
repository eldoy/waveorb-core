const loader = require('../../lib/loader.js')

describe('loader', () => {
  beforeEach(() => {
    process.env.WAVEORB_APP = undefined
  })

  it('should load an application', async () => {
    const app = await loader()
    expect(typeof app).toBe('object')
  })

  it('should load an application from process env', async () => {
    process.env.WAVEORB_APP = 'test/apps/app1'
    const app = await loader()
    expect(typeof app).toBe('object')
    expect(app.config.env.hello).toBe('bye')
  })
})
