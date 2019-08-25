const fs = require('fs')
const path = require('path')
const util = require('util')
const crypto = require('crypto')
const { write } = require('../../../dist/lib/write')

const readFile = util.promisify(fs.readFile)
const writeFile = util.promisify(fs.writeFile)
const unlink = util.promisify(fs.unlink)

beforeEach(() => {
  return writeFile('testfile', Buffer.alloc(100, crypto.randomBytes(100)))
})

describe('Specific write functions are correct:', () => {
  it('Truncate between 25% and 75% of the file', done => {
    write.init('testfile')
      .then(({ fileSize }) => write.truncate('testfile', fileSize))
      .then(({ fileSize }) => {
        expect(fileSize >= 25 && fileSize <= 75).toBeTruthy()
        unlink('testfile')
          .catch((err) => { throw err })
        done()
      })
      .catch((err) => { throw err })
  })

  it('Rename the file with a string of length 9', done => {
    write.init('testfile')
      .then(({ file }) => write.rename(file, 100))
      .then(({ file }) => {
        expect(path.basename(file)).toHaveLength(12)
        unlink(file)
          .catch((err) => { throw err })
        done()
      })
      .catch((err) => { throw err })
  })

  it('Write a random byte along the file', done => {
    write.init('testfile')
      .then(() => write.randomByte('testfile', 100))
      .then(() => readFile('testfile'))
      .then((result) => {
        expect(result).toStrictEqual(Buffer.alloc(100, result[0]))
        done()
      })
      .catch((err) => { throw err })
  })
})
