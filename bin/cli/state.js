const chalk = require('chalk')
const { cli } = require('cli-ux')
const { eventEmitter } = require('../../lib/methods')

var errors = 0

eventEmitter.on('writing', (file) => cli.action.start(chalk.bold.yellow('Writing ') + file))
eventEmitter.on('deleting', (file) => cli.action.start(chalk.bold.magenta('Deleting ') + file))
eventEmitter.on('info', (file, info) => cli.action.start(chalk.bold.blue(info) + file))
eventEmitter.on('ending', (file) => {
  cli.action.start(chalk.green('Done ') + file)
  cli.action.stop('')
})
eventEmitter.on('error', (file, err) => {
  cli.action.start(chalk.bold.red('Error ') + file)
  cli.action.stop('')
  cli.warn(chalk.yellow(err))
  errors++
})

module.exports = () => errors
