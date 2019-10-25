const fs = require('fs')
const srm = require('..')

const { tools } = require('./tools.js')(__dirname, __filename)

const ids = srm.validIDs
ids.splice(ids.indexOf('log'), 1)

describe('Each standard ends:', () => {
  for (let i = 0; i < ids.length; i++) {
    test('ID: ' + ids[i], done => {
      const folderName = tools.createPath()
      tools.fill(2, 1, 1, folderName)

      expect(fs.statSync(folderName).isDirectory()).toBeTruthy()

      srm(folderName, { standard: ids[i] }, (err) => {
        if (err) throw err
        expect(() => fs.statSync(folderName)).toThrow()
        done()
      })
    })
  }
})

afterAll(done => {
  tools.cleanup(done)
})
