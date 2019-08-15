const path = require('path')
const glob = require('glob')
const inquirer = require('inquirer')
const chalk = require('chalk')
const log = require('./log')
const srm = require('../../')
const { methods } = require('../../lib/methods')

function check (argv, { method, retries, force, globbing }) {
  let paths = []
  if (globbing) {
    for (let i = 0, len = argv.length; i < len; i++) {
      if (path.isAbsolute(argv[i])) {
        paths = paths.concat(argv[i])
      } else {
        paths = paths.concat(glob.sync(path.join(process.cwd(), argv[i])))
      }
    }
  } else paths = argv
  if (paths.length === 0) console.log(chalk.bold.yellow('No such file or directory.'))
  else {
    console.log(chalk.bold.yellow('Method: ' + methods[method].name + '\n'))
    if (force) remove(paths, method, retries)
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

function remove (paths, methodID, retries) {
  for (let i = paths.length - 1; i >= 0; i--) {
    const start = process.hrtime()
    srm(paths[i], { method: methodID, maxBusyTries: retries })
      .then((path) => log.info(chalk.cyan(path) + chalk.cyan.bold(` deleted in ${duration(start)}.`)))
      .catch((err) => log.error(chalk.red.bold('Deletion of ') + chalk.red(paths[i]) + chalk.red.bold(` failed in ${duration(start)}:\n`) + chalk.red(err)))
  }
}

function duration (start) {
  const diff = process.hrtime(start)
  return diff[0] > 0
    ? `${(diff[0] + diff[1] / 1e9).toFixed(3)}s (${diff[0] * 1e3 + diff[1] / 1e6} ms)`
    : `${diff[0] / 1e3 + diff[1] / 1e6} ms`
}

module.exports = check
