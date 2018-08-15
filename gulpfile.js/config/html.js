var config = require('./')

module.exports = function (env) {
    return {
      watch: config.sourceDirectory + '/views/**/*.swig',
      src: [config.sourceDirectory + '/views/**/*.swig', '!**/{layouts,shared}/**'],
      dest: config.publicDirectory,
      swig: {
        defaults: { cache: false, locals: { buildENV: env } }
      }
    }
}