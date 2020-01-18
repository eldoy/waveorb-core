module.exports = {
  createProject: {
    after: async function($) {
      return { hello: 'bye' }
    }
  }
}
