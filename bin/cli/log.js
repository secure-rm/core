const log = require('ololog').configure({ time: true, locate: false, tag: true }).handleNodeErrors()
const chalk = require('chalk')
const { eventEmitter } = require('../../lib/methods')

eventEmitter.on('starting', (file) => log(chalk.bold.yellow('Starting ') + file))
eventEmitter.on('unlinking', (file) => log(chalk.bold.magenta('Unlinking ') + file))
eventEmitter.on('done', (file) => log(chalk.bold.green('Done ') + file))

eventEmitter.on('info', (file, info) => log(chalk.bold.blue(info) + file))

eventEmitter.on('warn', (file, err) => log.warn(chalk.yellow(err) + file))
eventEmitter.on('error', (file, err) => log.error(chalk.red(err) + file))

module.exports = log
