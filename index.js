const { methods } = require('./lib/methods')
const secureRm = require('./lib/secureRm')
const command = require('./cli/command')

command.methods = methods
command.secureRm = secureRm

module.exports = command