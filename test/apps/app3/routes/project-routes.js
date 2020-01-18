module.exports = {
  createProject: {
    before: async function($) {
      return { hello: 'bye' }
    }
  }
}
