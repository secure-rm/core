const fs = require('fs')
const path = require('path')
const util = require('util')
const { write } = require('../../lib/write')
const expected = require('./write.expected.js')

const readFile = util.promisify(fs.readFile)
const writeFile = util.promisify(fs.writeFile)
const unlink = util.promisify(fs.unlink)

describe('Non-random write functions are correct:', () => {
  for (let i = 0; i < expected.length; i++) {
    let file = path.resolve(__dirname, expected[i].name || expected[i].function)

    test(expected[i].description, done => {
      writeFile(file, Buffer.from([0x05, 0xfa, 0x6a, 0x63, 0xe0, 0x2e, 0xea, 0x92, 0x65, 0xf9]))
        .then(() => write.init(file))
        .then(({ fileSize, file }) => {
          return expected[i].arg
            ? write[expected[i].function](file, expected[i].arg, fileSize)
            : write[expected[i].function](file, fileSize)
        })
        .then(({ file }) => readFile(file))
        .then((result) => {
          expect(result).toStrictEqual(expected[i].expectedValue)
          unlink(file)
            .catch((err) => { throw err })
          done()
        })
        .catch((err) => { throw err })
    })
  }
})
