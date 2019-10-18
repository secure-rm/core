const fs = require('fs')
const path = require('path')
const util = require('util')
const crypto = require('crypto')
const uuidv4 = require('uuid/v4')
const { write } = require('../../../dist/write')

const readFile = util.promisify(fs.readFile)
const writeFile = util.promisify(fs.writeFile)
const unlink = util.promisify(fs.unlink)

const uuidList = []

function getUUID () {
  const fileName = uuidv4()
  uuidList.push(fileName)
  return fileName
}

describe('Specific write functions are correct:', () => {
  it('Truncate between 25% and 75% of the file', done => {
    const fileName = getUUID()
    writeFile(fileName, Buffer.from(Buffer.alloc(100, crypto.randomBytes(100))))
      .then(() => write.init(fileName))
      .then(({ fileSize }) => write.truncate(fileName, fileSize))
      .then(({ fileSize }) => {
        expect(fileSize).toBeGreaterThanOrEqual(25)
        expect(fileSize).toBeLessThanOrEqual(75)
        done()
      })
      .catch((err) => { throw err })
  })

  it('Rename the file with a string of length 9', done => {
    const fileName = uuidv4()
    writeFile(fileName, Buffer.from(Buffer.alloc(100, crypto.randomBytes(100))))
      .then(() => write.init(fileName))
      .then(({ file }) => write.rename(file, 100))
      .then(({ file }) => {
        expect(path.basename(file)).toHaveLength(12)
        unlink(file)
          .catch((err) => { throw err })
          .then(() => done())
      })
      .catch((err) => unlink(fileName)
        .then(() => { throw err }))
  })

  it('Write a random byte along the file', done => {
    const fileName = getUUID()
    writeFile(fileName, Buffer.from(Buffer.alloc(100, crypto.randomBytes(100))))
      .then(() => write.init(fileName))
      .then(() => write.randomByte(fileName, 100))
      .then(() => readFile(fileName))
      .then((result) => {
        expect(result).toStrictEqual(Buffer.alloc(100, result[0]))
        done()
      })
      .catch((err) => { throw err })
  })
})

afterAll(done => {
  for (let i = 0; i < uuidList.length; i++) {
    unlink(uuidList[i])
      .catch((err) => { throw err })
  }
  done()
})
