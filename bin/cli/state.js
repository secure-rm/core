const chalk = require('chalk')
var Multispinner = require('multispinner')
const { eventEmitter } = require('../../lib/methods')

var multispinner = new Multispinner(
  { 'Start': 'Files analyzed' },
  {
    color: {
      incomplete: 'cyan',
      success: 'green',
      error: 'red'
    }
  }
)

multispinner.success('Start')

eventEmitter.on('writing', (file) => {
  multispinner.spinners[file] = {
    state: 'incomplete',
    current: '',
    text: chalk.bold.yellow('Writing ') + file
  }
})

eventEmitter.on('deleting', (file) => {
  multispinner.spinners[file] = {
    state: 'incomplete',
    current: '',
    text: chalk.bold.magenta('Deleting ') + file
  }
})

eventEmitter.on('info', (file, info) => {
  multispinner.spinners[file] = {
    state: 'incomplete',
    current: '',
    text: chalk.bold.blue(info) + file
  }
})

eventEmitter.on('ending', (file) => {
  multispinner.spinners[file].text = file
  multispinner.success(file)
  /* cli.action.start(chalk.green('Done ') + file)
  cli.action.stop('') */
})
eventEmitter.on('error', (file, err) => {
  multispinner.spinners[file] = {
    state: 'error',
    current: '',
    text: file + ' ' + chalk.bold.red(err)
  }
  // multispinner.error(file)
  /* cli.action.start(chalk.bold.red('Error ') + file)
  cli.action.stop('')
  cli.warn(chalk.yellow(err)) */
})
