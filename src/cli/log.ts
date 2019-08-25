import chalk from 'chalk'
import { eventEmitter } from '../lib/methods'
import ololog from 'ololog'
const log = ololog.configure({ time: true, locate: false, tag: true }).handleNodeErrors()

eventEmitter.on('start', (file) => log(chalk.bold.yellow('Starting ') + file))
eventEmitter.on('unlink', (file) => log(chalk.bold.magenta('Unlinking ') + file))
eventEmitter.on('done', (file) => log(chalk.bold.green('Done ') + file))

eventEmitter.on('info', (file, info) => log(chalk.bold.blue(info) + file))

eventEmitter.on('warn', (file, err) => log.warn(chalk.yellow(err) + file))
eventEmitter.on('error', (file, err) => log.error(chalk.red(err) + file))

export default log
