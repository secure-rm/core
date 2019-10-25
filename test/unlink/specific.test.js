const fs = require('fs')
const path = require('path')
const util = require('util')
const crypto = require('crypto')
const srm = require('../../')

const { target, tools } = require('../tools.js')(__dirname, __filename)

const readFile = util.promisify(fs.readFile)
const writeFile = util.promisify(fs.writeFile)

try {
  fs.mkdirSync(target)
} catch {
  console.log(target + ' already exists')
}

describe('Specific unlink functions are correct:', () => {
  it('Truncate between 25% and 75% of the file', done => {
    const fileName = tools.createPath()
    writeFile(fileName, Buffer.from(Buffer.alloc(100, crypto.randomBytes(100))))
      .then(() => srm(fileName, {
        customStandard: new srm.Standard({
          unlinkStandard: new srm.Unlink()
            .truncate()
            .then(function (file, fileSize) {
              return new Promise((resolve) => {
                expect(fileSize).toBeGreaterThanOrEqual(25)
                expect(fileSize).toBeLessThanOrEqual(75)
                resolve({ file, fileSize })
              })
            })
            .compile
        })
      }))
      .then(() => done())
      .catch((err) => { throw err })
  })

  it('Rename the file with a string of length 12', done => {
    const fileName = tools.createPath()
    writeFile(fileName, Buffer.from(Buffer.alloc(100, crypto.randomBytes(100))))
      .then(() => srm(fileName, {
        customStandard: new srm.Standard({
          unlinkStandard: new srm.Unlink()
            .rename()
            .then(function (file, fileSize) {
              return new Promise((resolve) => {
                expect(path.basename(file)).toHaveLength(12)
                resolve({ file, fileSize })
              })
            })
            .compile
        })
      }))
      .then(() => done())
      .catch((err) => { throw err })
  })

  it('Write a random byte along the file', done => {
    const fileName = tools.createPath()
    writeFile(fileName, Buffer.from(Buffer.alloc(100, crypto.randomBytes(100))))
      .then(() => srm(fileName, {
        customStandard: new srm.Standard({
          unlinkStandard: new srm.Unlink()
            .randomByte()
            .compile
        })
      }))
      .then(() => readFile(fileName))
      .then((result) => {
        expect(result).toStrictEqual(Buffer.alloc(100, result[0]))
        done()
      })
      .catch((err) => { throw err })
  })
})

afterAll(done => {
  tools.cleanup(done)
})
