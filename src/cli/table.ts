import chalk from 'chalk'
import Table from 'tty-table'
import { standards, validIDs } from '..'

// Draw the standards table

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

for (let i = 0; i < validIDs.length; i++) {
  rows.push([validIDs[i], standards[validIDs[i] as typeof validIDs].name, standards[validIDs[i] as typeof validIDs].passes, standards[validIDs[i] as typeof validIDs].description])
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

export default function table () {
  console.log(chalk.bold('METHODS'))
  console.log(str1)
}
