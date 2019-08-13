const fs = require('fs')
const path = require('path')
const chalk = require('chalk')
const { methods } = require('../lib/methods')

const regex = /(<!--AUTO GENERATED METHODS TABLE START-->\n)([\s\S]*)(\n<!--AUTO GENERATED METHODS TABLE END-->)/gm
const readme = path.join(__dirname, '../README.md')

var newText = `ID | Name | Passes | Description
-- | ---- | ------ | -----------`

for (let method in methods) {
  newText = newText.concat(`\n ${method} | ${methods[method].name} | ${methods[method].passes} | ${methods[method].description.replace(/(\r\n|\n|\r)/gm, '<br>')}`)
}

fs.readFile(readme, { encoding: 'UTF-8' }, (err, data) => {
  if (err) throw err
  const text = data.toString().replace(regex, '$1' + newText + '$3')
  fs.writeFile(readme, text, (err) => {
    if (err) throw err
    console.log('\n' + chalk.bold('Auto generated methods table has been saved to README.md!'))
  })
})
