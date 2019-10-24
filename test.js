const path = require('path')
const srm = require('.')

srm('./sample', { standard: 'randomData' }, (err) => {
  if (err) throw err
})
