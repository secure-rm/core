const path = require('path')
const fs = require('fs')
/* const fill = require('./test/fill.js')
const srm = require('.')

const p = path.resolve(__dirname, './target')
fill(4, 10, 2, p)

srm(p, { standard: 'secure' }, (err) => {
  if (err) throw err
  console.log('success')
}) */

try {
  fs.mkdirSync(path.resolve(__dirname, './target'))
} catch { }
