const chalk = require('chalk')
const ui = require('cliui')()
const { methods } = require('../../')

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
    width: 12
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
      width: 5
    },
    {
      text: methods[i].name,
      width: 30
    },
    {
      text: methods[i].passes,
      width: 12
    },
    {
      text: methods[i].description,
      width: 60
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
