const { Command, flags } = require('@oclif/command')
const { methods } = require('../../')
const handle = require('./handle')
const table = require('./table')

class SecureRmCommand extends Command {
  async run () {
    const { flags, argv } = this.parse(SecureRmCommand)
    if (flags.table) {
      table()
    } else {
      handle(argv, flags.method, flags.keep, flags.force)
    }
  }
}

SecureRmCommand.description = `Simple tool to securely erase files
...
Extra documentation goes here
`

SecureRmCommand.flags = {
  // add --version flag to show CLI version
  version: flags.version({ char: 'v' }),
  // add --help flag to show CLI version
  help: flags.help({ char: 'h' }),
  method: flags.option({
    char: 'm',
    description: 'erasure method',
    options: Array.from(Array(methods.length).keys()).toString()
  }),
  force: flags.boolean({ char: 'f', description: 'avoid checks' }),
  table: flags.boolean({ char: 't', description: 'show methods' })
}

SecureRmCommand.args = [{ name: 'path', required: true }]

SecureRmCommand.strict = false

module.exports = SecureRmCommand
