const fs = require('fs-extra')
const srm = require('..')

const tools = require('./tools')(__dirname, __filename)

describe('Each standard ends:', () => {
  for (const key in srm.standards) {
    const standard = srm.standards[key]
    it('ID: ' + key, async () => {
      const folderName = tools.createPath()
      tools.fill(2, 2, 1, folderName)
      expect(fs.statSync(folderName).isDirectory()).toBeTruthy()
      await srm.remove(folderName, { standard })
      expect(() => fs.statSync(folderName)).toThrow()
    })
  }
})

afterAll(async () => {
  tools.cleanup()
})
