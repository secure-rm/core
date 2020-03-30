const fs = require('fs-extra')
const srm = require('..')

const tools = require('./tools')(__dirname, __filename)

describe('Each standard ends:', () => {
  for (const key in srm.standards) {
    if (key === 'mark') continue
    const standard = srm.standards[key]
    it('ID: ' + key, async () => {
      const folderName = tools.createPath()
      tools.fill(2, 2, 1, folderName)
      expect(fs.statSync(folderName).isDirectory()).toBeTruthy()
      await srm.remove(folderName, { standard })
      expect(() => fs.statSync(folderName)).toThrow()
    })
  }

  it('ID: mark', async () => {
    const folderName = tools.createPath()
    tools.fill(2, 2, 1, folderName)
    tools.fill(2, 2, 1, tools.createPath())
    expect(fs.statSync(folderName).isDirectory()).toBeTruthy()
    let count = 0 // TODO
    srm.eventEmitter.on('mark', () => count++)
    await srm.remove(folderName, { standard: srm.standards.mark })
    expect(fs.statSync(folderName).isDirectory()).toBeTruthy()
    expect(count).toStrictEqual(10)
  })
})

afterAll(async () => {
  tools.cleanup()
})
