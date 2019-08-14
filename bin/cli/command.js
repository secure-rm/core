const { Command, flags } = require('@oclif/command')
const Parser = require('@oclif/parser')
const chalk = require('chalk')
const check = require('./check')
const table = require('./table')
const { methods } = require('../../lib/methods')

const validIDs = Array.from(Object.keys(methods))

flags.custom = (opts = {}, action) => {
  return Parser.flags.boolean(Object.assign(
    opts, {
      parse: (_, cmd) => {
        action()
        cmd.exit(0)
      }
    }))
}

class SecureRmCommand extends Command {
  async run () {
    const { flags, argv } = this.parse(SecureRmCommand)
    check(argv, flags)
  }
}

SecureRmCommand.description = `CLI help:
Completely erases files by making recovery impossible.
For extra documentation, go to https://www.npmjs.com/package/secure-rm
`

SecureRmCommand.flags = {
  // add --version flag to show CLI version
  version: flags.version({ char: 'v' }),
  // add --help flag to show CLI version
  help: flags.help({ char: 'h' }),
  method: flags.option({
    char: 'm',
    description: 'select the erasure method',
    default: 'secure',
    parse: input => {
      if (validIDs.includes(input)) return input
      else {
        console.log(chalk.bold.yellow(`'${input}' is not a valid ID. \nList of valid IDs: ${validIDs}`))
        return 'secure'
      }
    }
  }),
  retries: flags.option({
    char: 'r',
    description: 'max retries if error',
    parse: input => {
      return typeof input === 'number'
        ? input
        : null
    }
  }),
  force: flags.boolean({ char: 'f', description: 'avoid checks' }),
  globbing: flags.boolean({ char: 'g', description: 'allow or not file globbing', default: true, allowNo: true }),
  table: flags.custom({ char: 't', description: 'show the methods table' }, table)
}

SecureRmCommand.args = [{ name: 'path', required: true }]

SecureRmCommand.strict = false

module.exports = SecureRmCommand
