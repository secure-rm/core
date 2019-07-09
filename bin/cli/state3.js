const log = require('ololog').configure({ time: true, locate: false, tag: true })
const chalk = require('chalk')
const { eventEmitter } = require('../../lib/methods')

eventEmitter.on('writing', (file) => log.info(chalk.bold.yellow('Writing ') + file))
eventEmitter.on('deleting', (file) => log.info(chalk.bold.magenta('Deleting ') + file))
eventEmitter.on('info', (file, info) => log.info(chalk.bold.blue(info) + file))
eventEmitter.on('ending', (file) => {
  log.info(chalk.green('Done ') + file)
})
eventEmitter.on('error', (file, err) => {
  log.error(chalk.bold.red('Error ') + file)
  log.warn(chalk.yellow(err))
})
