const path = require('path')
const glob = require('glob')
const inquirer = require('inquirer')
const chalk = require('chalk')
const log = require('./log')
const { methods } = require('../../lib/methods')
const rm = require('../../')

function handle (argv, method = '0', force) {
  method = parseInt(method)
  var paths = []
  for (let i = 0, len = argv.length; i < len; i++) {
    paths = paths.concat(glob.sync(path.join(process.cwd(), argv[i])))
  }
  if (paths.length === 0) console.log(chalk.bold.yellow('No such file or directory.'))
  else {
    console.log(chalk.bold.yellow('Method: ' + methods[method].name + '\n'))
    if (force) remove(paths, method)
    else {
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
          if (answers.choices.length === 0) console.log(chalk.bold.yellow('No file or directory selected.'))
          else remove(answers.choices, method)
        })
    }
  }
}

function remove (paths, method) {
  for (let i = paths.length - 1; i >= 0; i--) {
    let start = process.hrtime()
    rm(paths[i], method, (err) => {
      let diff = process.hrtime(start)
      let timeFixed = diff[0] > 0
        ? `${(diff[0] + diff[1] / 1e9).toFixed(3)}s (${diff[0] * 1e3 + diff[1] / 1e6} ms)`
        : `${diff[0] / 1e3 + diff[1] / 1e6} ms`
      if (err) log.error(chalk.red.bold('Deletion of ') + chalk.red(paths[i]) + chalk.red.bold(` failed in ${timeFixed}:\n`) + chalk.red(err))
      else log.info(chalk.cyan(paths[i]) + chalk.cyan.bold(` deleted in ${timeFixed}.`))
    })
  }
}

module.exports = handle
