var Multispinner = require('multispinner')
const chalk = require('chalk')

var multispinner = new Multispinner({
  'Foo': 'Downloading Foo',
  'Bar': 'Transpiling Bar',
  'Baz': 'Writing Baz'
})

multispinner.success('Bar')

multispinner.spinners.test = {
  state: 'incomplete',
  current: '',
  text: chalk.yellow('hey')
}
