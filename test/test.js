const srm = require('..')
const path = require('path')

console.log(srm)
console.log(path.resolve('./test/junk'))

srm.remove('./test/junk/node_modules', srm.standards.myFs)
  .then(() => console.log('success'))
  .catch(err => console.log(err))
