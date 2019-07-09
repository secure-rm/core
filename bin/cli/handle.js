const path = require('path')
const glob = require('glob')
const inquirer = require('inquirer')
const chalk = require('chalk')
const { CLIError } = require('@oclif/errors')
// const { cli } = require('cli-ux')
const { methods } = require('../../lib/methods')
const rm = require('../../')
require('./state')

function handle (argv, method = '1', force) {
  method = parseInt(method)
  console.log(chalk.bold.yellow('Method: ' + methods[method].name + '\n'))
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
    rm(paths[i], method, (err) => {
      // if (err === 'EBUSY') throw new CLIError('Resource busy or locked. (You are maybe trying to delete the current directory!)')
      // if (err.code === 'EMFILE') cli.warn(chalk.yellow(`Too many open files, cannot open ${err.path}`))
      if (err) console.log('ERROR' + err)
    })
  }
}

module.exports = handle
