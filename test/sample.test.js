const fs = require('fs')
const path = require('path')
const fill = require('./fill.js')
const srm = require('../')

test('adds 1 + 2 to equal 3', () => {
  expect(1 + 2).toBe(3)
})

test('async removal', done => {
  const p = path.resolve(__dirname, './target')
  fill(4, 10, 2, p)

  expect(fs.statSync(p).isDirectory()).toBeTruthy()

  srm(p, { standard: 'randomData' }, (err) => {
    if (err) throw err
    expect(() => fs.statSync(p)).toThrow()
    done()
  })
})
