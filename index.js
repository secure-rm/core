const secureRm = require('./dist/lib/secure-rm')

let srm = secureRm.default
srm.write = secureRm.write
srm.event = secureRm.eventEmitter

module.exports = srm
