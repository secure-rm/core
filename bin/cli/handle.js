const path = require('path')
const glob = require('glob')
const inquirer = require('inquirer')
const chalk = require('chalk')
const { CLIError } = require('@oclif/errors')
const { secureRm, methods } = require('../../')

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
    secureRm(paths[i], method, (err) => {
      if (err === 'EBUSY') throw new CLIError('Resource busy or locked. (You are maybe trying to delete the current directory!)')
      if (err) console.log(err)
    })
  }
}

require('./state')

module.exports = handle
