const { methods } = require('../lib/methods')

console.log(
  `ID | Name | Passes | Description
-- | ---- | ------ | -----------`)

for (let i = 0, l = methods.length; i < l; i++) {
  console.log(` ${i} | ${methods[i].name} | ${methods[i].passes} | ${methods[i].description.replace('\n', '\\n')}`)
}
