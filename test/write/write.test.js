const fs = require('fs')
const path = require('path')
const util = require('util')
const { write } = require('../../lib/write')

const readFile = util.promisify(fs.readFile)
const copyFile = util.promisify(fs.copyFile)
const unlink = util.promisify(fs.unlink)

const base = path.resolve(__dirname, './base')
const nonRandomFunctions = ['zeroes', 'ones', 'complementary']

describe('Non-random write functions are correct:', () => {
  for (let i = 0; i < nonRandomFunctions.length; i++) {
    test(nonRandomFunctions[i].toString(), done => {
      copyFile(base, path.resolve(__dirname, nonRandomFunctions[i]))
        .then(() => write.init(path.resolve(__dirname, nonRandomFunctions[i])))
        .then(({ fileSize, file }) => write[nonRandomFunctions[i]](file, fileSize))
        .then(({ file }) => readFile(file))
        .then((result) => readFile(path.resolve(__dirname, './file-reference', nonRandomFunctions[i]))
          .then((expected) => {
            expect(result).toStrictEqual(expected)
            done()
          })
          .catch((err) => { throw err }))
        .catch((err) => { throw err })
    })
  }
})

afterAll(() => {
  for (let i = 0; i < nonRandomFunctions.length; i++) {
    unlink(path.resolve(__dirname, nonRandomFunctions[i]))
      .catch((err) => { throw err })
  }
})
