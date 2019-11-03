const fs = require('fs')
const srm = require('..')

const tools = require('./tools.js')(__dirname, __filename)

const ids = JSON.parse(JSON.stringify(srm.validIDs))
ids.splice(ids.indexOf('preview'), 1)

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

describe('Preview function', () => {
  test('Has correct length', done => {
    const folderName1 = tools.createPath()
    tools.fill(2, 2, 1, folderName1)
    expect(fs.statSync(folderName1).isDirectory()).toBeTruthy()

    srm(folderName1, { standard: 'preview' }, (err) => {
      if (err) throw err
    })

    const folderName = tools.createPath()
    tools.fill(3, 3, 3, folderName)
    expect(fs.statSync(folderName).isDirectory()).toBeTruthy()

    srm(folderName, { standard: 'preview' }, (err, tree) => {
      if (err) throw err
      expect(tree).toHaveLength(77)
      done()
    })
  })
})

afterAll(done => {
  tools.cleanup(done)
})
