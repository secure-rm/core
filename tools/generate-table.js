const fs = require('fs')
const path = require('path')
const chalk = require('chalk')
const { methods } = require('../lib/methods')

const regex = /(<!--AUTO GENERATED METHODS TABLE START-->\n)([\s\S]*)(\n<!--AUTO GENERATED METHODS TABLE END-->)/gm
const readme = path.join(__dirname, '../README.md')

var newText = `ID | Name | Passes | Description
-- | ---- | ------ | -----------`

for (let i = 0, l = methods.length; i < l; i++) {
  newText = newText.concat(`\n ${i} | ${methods[i].name} | ${methods[i].passes} | ${methods[i].description.replace(/(\r\n|\n|\r)/gm, '<br>')}`)
}

fs.readFile(readme, (err, data) => {
  if (err) throw err
  let text = data.toString().replace(regex, '$1' + newText + '$3')
  fs.writeFile(readme, text, (err) => {
    if (err) throw err
    console.log('\n' + chalk.bold('Auto generated methods table has been saved to README.md!'))
  })
})
