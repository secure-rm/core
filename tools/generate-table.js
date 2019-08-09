const fs = require('fs')
const path = require('path')
const chalk = require('chalk')
const { methods } = require('../lib/methods')

const regex = /(<div id="methods-table">)([\s\S]*)(<\/div>)/gm
const readme = path.join(__dirname, '../README.md')

var newText = `ID | Name | Passes | Description
-- | ---- | ------ | -----------`

for (let i = 0, l = methods.length; i < l; i++) {
  newText = newText.concat(`\n ${i} | ${methods[i].name} | ${methods[i].passes} | ${methods[i].description.replace(/(\r\n|\n|\r)/gm, '<br>')}`)
}

console.log(chalk.bold('\n NEW TABLE \n'))
console.log(chalk.yellow(newText))

fs.readFile(readme, (err, data) => {
  if (err) throw err
  let text = data.toString().replace(regex, '$1\n' + newText + '\n$3')
  fs.writeFile(readme, text, (err) => {
    if (err) throw err
    console.log('\n' + chalk.bold('The file has been saved!'))
  })
})
