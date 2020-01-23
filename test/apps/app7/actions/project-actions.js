module.exports = {
  createProject: {
    validate: {
      data: {
        name: {
          minlength: 5
        }
      }
    },
    main: async function($) {
      return { hello: 'bye' }
    }
  }
}
