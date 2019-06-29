const { Command, flags } = require('@oclif/command')
const { methods } = require('../lib/methods')
const handle = require('./handle')

class SecureRmCommand extends Command {
  async run () {
    const { flags, argv } = this.parse(SecureRmCommand)
    handle(argv, flags.method, flags.keep, flags.force)
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
    options:
      Object.keys(methods).map(key => key)
        .concat(Object.keys(methods).map(key => methods[key].name))
  }),
  force: flags.boolean({ char: 'f', description: 'avoid checks' })
}

// HACK! need to find another way to have multiple arguments

SecureRmCommand.args = new Array(2000).fill({ name: 'path', hidden: true })
SecureRmCommand.args[0] = { name: 'path', required: true }
SecureRmCommand.args[1] = { name: 'other paths' }

module.exports = SecureRmCommand
