const fs = require('fs')
const util = require('util')
const uuidv4 = require('uuid/v4')
const { write } = require('../../../dist/write')
const expected = require('./write-non-random-expectation.js')

const readFile = util.promisify(fs.readFile)
const writeFile = util.promisify(fs.writeFile)
const unlink = util.promisify(fs.unlink)

const uuidList = []

function getUUID () {
  const fileName = uuidv4()
  uuidList.push(fileName)
  return fileName
}

describe('Non-random write functions are correct:', () => {
  for (let i = 0; i < expected.length; i++) {
    it(expected[i].description, done => {
      const fileName = getUUID()
      writeFile(fileName, Buffer.from([0x05, 0xfa, 0x6a, 0x63, 0xe0, 0x2e, 0xea, 0x92, 0x65, 0xf9]))
        .then(() => write.init(fileName))
        .then(() => {
          return expected[i].arg
            ? write[expected[i].function](fileName, expected[i].arg, 10)
            : write[expected[i].function](fileName, 10)
        })
        .then(() => readFile(fileName))
        .then((result) => {
          expect(result).toStrictEqual(expected[i].expectedValue)
          done()
        })
        .catch((err) => { throw err })
    })
  }
})

afterAll(done => {
  for (let i = 0; i < uuidList.length; i++) {
    unlink(uuidList[i])
      .catch((err) => { throw err })
  }
  done()
})
