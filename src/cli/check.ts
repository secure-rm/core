import inquirer from 'inquirer'
import chalk from 'chalk'
import { standards, event } from '..'
import srm from '..'
require('./deprecated')

let log: any

interface Flags {
  standard: keyof typeof standards | undefined
  retries: number | undefined
  force: boolean
  mute: boolean
  globbing: boolean
  version: void
  help: void
  table: void
}

export default function check(paths: string[], flags: Flags) {
  log = require('./log')(flags.mute)
  console.log(chalk.bold.yellow('Method: ' + standards[flags.standard as keyof typeof standards].name + '\n'))

  if (flags.force) remove(paths, flags.standard as keyof typeof standards, flags.retries)
  // Ask for confirmation
  else {
    inquirer.prompt([
      {
        type: 'checkbox',
        message: 'Do you really want to delete these files?',
        name: 'choices',
        choices: paths.map(p => {
          var obj = {
            name: p
          }
          return obj
        })
      }
    ])
      .then(answers => {
        if (answers.choices.length === 0) console.log(chalk.bold.yellow('No file or directory selected.'))
        else remove(answers.choices, flags.standard as keyof typeof standards, flags.retries)
      })
  }
}

let errorsRecord: { [key: string]: string[]} = {}

event.on('error', (file, err) => {
  errorsRecord[err] = errorsRecord[err] || []
  errorsRecord[err].push(file)
})

function remove(paths: string[], standardID: keyof typeof standards, retries: number | undefined) {
  let progress = 0
  for (let i = paths.length - 1; i >= 0; i--) {
    // Record time
    const start = process.hrtime()

    srm(paths[i], { standard: standardID, maxBusyTries: retries }, (err: NodeJS.ErrnoException | null, path: string) => {
      if (err) log.error(chalk.red.bold('Deletion of ') + chalk.red(paths[i]) + chalk.red.bold(` failed in ${duration(start)}:\n`) + chalk.red(err.toString()))
      else log.info(chalk.cyan(path) + chalk.cyan.bold(` deleted in ${duration(start)}.`))
      progress++
      if (progress === paths.length) {
        if (Object.keys(errorsRecord).length !== 0) {
          log.error(chalk.cyan('Process ended with errors:\n'))
          for (let err in errorsRecord) {
            log(chalk.cyan.bold(err) + chalk.cyan('\n    ' + errorsRecord[err].reduce((accumulator: string, currentValue: string) => `${accumulator}\n    ${currentValue}`)))
          }
        } else {
          log.info(chalk.bold.cyan('Process ended without errors.'))
        }
      }
    })
  }
}

// Time taken
function duration(start: [number, number]) {
  const diff = process.hrtime(start)
  return diff[0] > 0
    ? `${(diff[0] + diff[1] / 1e9).toFixed(3)}s (${diff[0] * 1e3 + diff[1] / 1e6} ms)`
    : `${diff[0] / 1e3 + diff[1] / 1e6} ms`
}
