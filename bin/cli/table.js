const chalk = require('chalk')
const Table = require('tty-table')
const { methods } = require('../../lib/methods')

const header = [
  {
    value: "Id",
    headerColor: "yellow",
    color: "magenta",
    width: 10
  },
  {
    value: "Name",
    color: "white",
    width: 30
  },
  {
    value: "Passes",
    color: "white",
    width: 15,
  },
  {
    value: "Description",
    color: "white",
    align: "left"
  }
]

var rows = []

for (let i = 0, l = methods.length; i < l; i++) {
  rows.push([i, methods[i].name, methods[i].passes, methods[i].description])
}

var t1 = Table(header, rows, {
  borderStyle: 1,
  borderColor: "blue",
  paddingBottom: 0,
  headerAlign: "center",
  align: "center",
  color: "white",
  // truncate: "..."
})

const str1 = t1.render()

function table() {
  console.log(chalk.bold('METHODS'))
  console.log(str1)
}

module.exports = table
