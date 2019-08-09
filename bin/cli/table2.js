const chalk = require('chalk')
const ui = require('cliui')()
const { methods } = require('../../lib/methods')

ui.div(
  {
    text: chalk.bold.yellow('Id'),
    width: 5
  },
  {
    text: chalk.bold.yellow('Name'),
    width: 30
  },
  {
    text: chalk.bold.yellow('Passes'),
    width: 12,
    align: 'center'
  },
  {
    text: chalk.bold.yellow('Description'),
    width: 80
  }
)

for (let i = 0, l = methods.length; i < l; i++) {
  ui.div(
    {
      text: i,
      width: 5,
      border: true
    },
    {
      text: methods[i].name,
      width: 30,
      border: true
    },
    {
      text: methods[i].passes,
      width: 12,
      border: true
    },
    {
      text: methods[i].description,
      width: 60,
      border: true
    }
  )
  /* ui.div(
    `${i}\t ${methods[i].name}\t ${methods[i].passes}\t ${methods[i].description}\n`
  ) */
}

function table () {
  console.log(chalk.bold('METHODS\n'))
  console.log(ui.toString())
}

module.exports = table
