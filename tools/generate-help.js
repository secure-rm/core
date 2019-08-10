const fs = require('fs')
const path = require('path')
const chalk = require('chalk')
const exec = require('child_process').exec

const regex = /(<!--AUTO GENERATED HELP START-->\n```shell\n)([\s\S]*)(\n```\n<!--AUTO GENERATED HELP END-->)/gm
const readme = path.join(__dirname, '../README.md')

function execute (command, callback) {
  exec(command, function (err, stdout, _stderr) { callback(err, stdout) })
}

execute('node bin/run "-h"', (err, stdout) => {
  if (err) throw err
  fs.readFile(readme, (err, data) => {
    if (err) throw err
    let text = data.toString().replace(regex, '$1' + stdout + '$3')
    fs.writeFile(readme, text, (err) => {
      if (err) throw err
      console.log('\n' + chalk.bold('Auto generated help has been saved to README.md!'))
    })
  })
})
