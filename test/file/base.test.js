const fs = require('fs-extra')
const events = require('events')
const srm = require('../../')

const tools = require('../tools')(__dirname, __filename)
const eventEmitter = new events.EventEmitter()

const unit = [].concat(
  require('./_expected.js').unit1,
  require('./_expected.json').unit1
)

describe('Non-random file functions are correct:', () => {
  for (let i = 0; i < unit.length; i++) {
    const current = unit[i]
    it(current.description, async () => {
      const fileName = tools.createPath()
      await fs.writeFile(fileName, Buffer.from([0x05, 0xfa, 0x6a, 0x63, 0xe0, 0x2e, 0xea, 0x92, 0x65, 0xf9]))
      const fileData = await srm.fileMethods.init(fileName, eventEmitter)
      await srm.fileMethods[current.function](fileData, current.options)
      await fs.close(fileData.fd)
      const result = await fs.readFile(fileName)
      expect(result).toStrictEqual(Buffer.from(current.result))
    })
  }
})

afterAll(async () => {
  tools.cleanup()
})
