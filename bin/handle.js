const path = require('path')
const glob = require('glob')
const inquirer = require('inquirer')
const chalk = require('chalk')
const logSymbols = require('log-symbols')
const { CLIError } = require('@oclif/errors')
const { cli } = require('cli-ux')
const { eventEmitter } = require('../lib/methods')
const secureRm = require('../lib/secure-rm')

function handle (argv, method = '2', force) {
  var paths = []
  for (let i = 0, len = argv.length; i < len; i++) {
    paths = paths.concat(glob.sync(path.join(process.cwd(), argv[i])))
  }
  if (paths.length === 0) {
    throw new CLIError('No such file or directory.')
  }
  if (force) {
    remove(paths, method)
  } else {
    inquirer.prompt([
      {
        type: 'checkbox',
        message: 'Do you really want to delete these files?',
        name: 'choices',
        choices: paths.map(p => {
          var obj = {}
          obj.name = p
          return obj
        })
      }
    ])
      .then(answers => {
        remove(answers.choices, method)
      })
  }
}

function remove (paths, method) {
  for (let i = paths.length - 1; i >= 0; i--) {
    secureRm(paths[i], method, (err) => {
      if (err === 'EBUSY') throw new CLIError('Resource busy or locked. (You are maybe trying to delete the current directory!)')
      if (err) console.log(err)
    })
  }
}

eventEmitter.on('writing', (file) => cli.action.start(chalk.bold.yellow('Writing ') + file))
eventEmitter.on('deleting', (file) => cli.action.start(chalk.bold.magenta('Deleting ') + file))
eventEmitter.on('info', (file, info) => cli.action.start(chalk.bold.blue(info) + file))
eventEmitter.on('ending', (file) => {
  cli.action.start(chalk.green('Done ') + file)
  cli.action.stop(logSymbols.success)
})
eventEmitter.on('error', (file, err) => {
  cli.action.start(chalk.bold.red('Error ') + file)
  cli.action.stop(logSymbols.error)
  cli.warn(chalk.yellow(err))
})

module.exports = handle
