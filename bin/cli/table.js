const chalk = require('chalk')
const Table = require('tty-table')
const { methods } = require('../../lib/methods')

const header = [
  {
    value: 'Id',
    color: 'redBright',
    width: 50
  },
  {
    value: 'Name',
    color: 'white'
  },
  {
    value: 'Passes',
    color: 'white',
    width: 30
  },
  {
    value: 'Description',
    color: 'white',
    align: 'left'
  }
]

var rows = []

for (let method in methods) {
  rows.push([method, methods[method].name, methods[method].passes, methods[method].description])
}

var t1 = Table(header, rows, {
  borderStyle: 1,
  borderColor: 'cyan',
  paddingBottom: 0,
  headerAlign: 'center',
  headerColor: 'yellow',
  align: 'center',
  color: 'white'
  // truncate: "..."
})

const str1 = t1.render()

function table () {
  console.log(chalk.bold('METHODS'))
  console.log(str1)
}

module.exports = table
