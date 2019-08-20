const path = require('path')
const glob = require('glob')
const inquirer = require('inquirer')
const chalk = require('chalk')
const log = require('./log')
const srm = require('../../')
const { methods, eventEmitter } = require('../../lib/methods')

function check (argv, { method, retries, force, globbing }) {
  let paths = []
  // Search for files if globbing is enabled
  if (globbing) {
    for (let i = 0; i < argv.length; i++) {
      // If relative path, transform to absolute
      if (!path.isAbsolute(argv[i])) {
        argv[i] = path.join(process.cwd(), argv[i])
      }

      // If on windows, transform backslashes in forwardslashes
      if (path.sep !== '/') {
        argv[i] = argv[i].split(path.sep).join('/')
      }

      // Search for files
      paths = paths.concat(glob.sync(argv[i]))
    }
  } else paths = argv
  if (paths.length === 0) console.log(chalk.bold.yellow('No such file or directory.'))

  // if there are files then continue
  else {
    console.log(chalk.bold.yellow('Method: ' + methods[method].name + '\n'))
    if (force) remove(paths, method, retries)

    // Ask for confirmation
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

let errorsRecord = {}

eventEmitter.on('error', (file, err) => {
  errorsRecord[err] = errorsRecord[err] || []
  errorsRecord[err].push(file)
})

function remove (paths, methodID, retries) {
  let progress = 0
  for (let i = paths.length - 1; i >= 0; i--) {
    // Record time
    const start = process.hrtime()

    srm(paths[i], { method: methodID, maxBusyTries: retries }, (err, path) => {
      if (err) log.error(chalk.red.bold('Deletion of ') + chalk.red(paths[i]) + chalk.red.bold(` failed in ${duration(start)}:\n`) + chalk.red(err))
      else log.info(chalk.cyan(path) + chalk.cyan.bold(` deleted in ${duration(start)}.`))
      progress++
      if (progress === paths.length) {
        if (Object.keys(errorsRecord).length !== 0) {
          log.info(chalk.cyan('Process ended with errors:\n'))
          for (let err in errorsRecord) {
            log(chalk.cyan.bold(err) + chalk.cyan('\n    ' + errorsRecord[err].reduce((accumulator, currentValue) => `${accumulator}\n    ${currentValue}`)))
          }
        }
      }
    })
  }
}

// Time taken
function duration (start) {
  const diff = process.hrtime(start)
  return diff[0] > 0
    ? `${(diff[0] + diff[1] / 1e9).toFixed(3)}s (${diff[0] * 1e3 + diff[1] / 1e6} ms)`
    : `${diff[0] / 1e3 + diff[1] / 1e6} ms`
}

module.exports = check
