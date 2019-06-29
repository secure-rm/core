const rimraf = require('rimraf')
const {methods} = require('./methods')

function secureRm(path, method) {
    rimraf(path, methods[method].customFs, (err) => err)
}

module.exports = secureRm
