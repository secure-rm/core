import { Command, flags } from '@oclif/command'
import * as Parser from '@oclif/parser'
import path from 'path'
import glob from 'glob'
import chalk from 'chalk'
import { validIDs, standards } from '..'
import check from './check'
import table from './table'

type Standard = keyof typeof standards

// Custom flag
const customFlag = (opts = {}, action: () => void) => {
  return Parser.flags.boolean(Object.assign(
    opts, {
      parse: (_: any, cmd: any) => {
        action()
        cmd.exit(0)
      }
    }))
}

class SecureRmCommand extends Command {
  static description = `CLI help:
Completely erases files by making recovery impossible.
For extra documentation, go to https://www.npmjs.com/package/secure-rm
`
  static examples = [
    '$ secure-rm ./folder/*.js ./file.js -s gutmann -f',
    '$ secure-rm /d/code -m',
  ]

  static flags = {
    // add --version flag to show CLI version
    version: flags.version({ char: 'v' }),
    // add --help flag to show CLI version
    help: flags.help({ char: 'h' }),
    standard: flags.option({
      char: 's',
      description: 'select the erasure standard',
      default: 'secure',
      parse: (input): Standard => {
        if (validIDs.includes(input)) return input as Standard
        else {
          console.log(chalk.bold.yellow(`'${input}' is not a valid ID. \nList of valid IDs: ${validIDs}`))
          return 'secure'
        }
      }
    }),
    retries: flags.option({
      char: 'r',
      description: 'max retries if error',
      default: 3,
      parse: (input): number => {
        return isNaN(parseInt(input))
          ? 3
          : parseInt(input)
      }
    }),
    force: flags.boolean({ char: 'f', description: 'avoid checks' }),
    mute: flags.boolean({ char: 'm', description: 'mutes the cli to the bare minimum' }),
    globbing: flags.boolean({ description: 'allow or not file globbing', default: true, allowNo: true }),
    table: customFlag({ char: 't', description: 'show the standards table' }, table)
  }

  static args = [{ name: 'path', required: true }]

  // Multiple args allowed
  static strict = false

  async run() {
    const { argv, flags } = this.parse(SecureRmCommand)

    let paths: string[] = []

    // Search for files if globbing is enabled
    if (flags.globbing) {
      for (let i = 0; i < argv.length; i++) {
        // If relative path, transform to absolute
        if (!path.isAbsolute(argv[i])) {
          argv[i] = path.join(process.cwd(), argv[i])
        }

        // If on Windows, transform backslashes in forwardslashes
        if (path.sep !== '/') {
          argv[i] = argv[i].split(path.sep).join('/')
        }

        // Search for files
        paths = paths.concat(glob.sync(argv[i]))
      }
    } else paths = argv
    if (paths.length === 0) console.log(chalk.bold.yellow('No such file or directory.'))

    // if there are files then continue
    else check(argv, flags)
  }
}

export = SecureRmCommand
