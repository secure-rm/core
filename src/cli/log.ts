import chalk from 'chalk'
import { event } from '..'
import ololog from 'ololog'
const log = ololog.configure({ time: true, locate: false, tag: true }).handleNodeErrors()

export = (mute: boolean) => {
  if (!mute) {
    event.on('start', (file) => log(chalk.bold.yellow('Starting ') + file))
    event.on('unlink', (file) => log(chalk.bold.magenta('Unlinking ') + file))
    event.on('done', (file) => log(chalk.bold.green('Done ') + file))

    event.on('verbose', (file, info) => log(chalk.bold.blue(info) + file))

    event.on('warn', (file, err) => log.warn(chalk.yellow(err) + file))
    event.on('error', (file, err) => log.error(chalk.red(err) + file))
  }
  return log
}
