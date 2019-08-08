const log = require('ololog').configure({ time: true, locate: false, tag: true })
const chalk = require('chalk')
const { eventEmitter } = require('../../lib/methods')

eventEmitter.on('starting', (file) => log(chalk.bold.yellow('Starting ') + file))
eventEmitter.on('deleting', (file) => log(chalk.bold.magenta('Deleting ') + file))
eventEmitter.on('info', (file, info) => log(chalk.bold.blue(info) + file))
eventEmitter.on('ending', (file) => {
  log(chalk.green('Done ') + file)
})
eventEmitter.on('error', (file, err) => {
  log.error(chalk.bold.red('Error ') + file)
  log.warn(chalk.yellow(err))
})
