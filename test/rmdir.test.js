const fs = require('fs')
const path = require('path')
const util = require('util')
const srm = require('../')

const tools = require('./tools.js')(__dirname, __filename)

const mkdir = util.promisify(fs.mkdir)

test('Rename the file with a string of length 12', done => {
  const folderName = tools.createPath()
  mkdir(folderName)
    .then(() => srm(folderName, {
      customStandard: new srm.Standard({
        rmDirStandard: new srm.RmDir()
          .rename()
          .then(function (p) {
            return new Promise((resolve) => {
              expect(path.basename(p)).toHaveLength(12)
              resolve(p)
            })
          })
          .compile
      })
    }))
    .then(() => done())
    .catch((err) => { throw err })
})

afterAll(done => {
  tools.cleanup(done)
})
