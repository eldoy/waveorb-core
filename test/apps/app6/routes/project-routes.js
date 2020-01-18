module.exports = {
  createProject: {
    filters: ['user'],
    main: async function($) {
      return { hello: $.hello }
    }
  }
}
