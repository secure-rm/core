const fs = require('fs-extra')
const events = require('events')
const srm = require('../../')

const tools = require('../tools')(__dirname, __filename)
const eventEmitter = new events.EventEmitter()

const unit = [].concat(
  require('./_expected.js').unit1,
  require('./_expected.json').unit1,
  [
    {
      function: 'random',
      description: 'Write random data'
    },
    {
      function: 'randomByte',
      description: 'Write random byte'
    }
  ]
)

describe('Correct checksum:', () => {
  for (let i = 0; i < unit.length; i++) {
    const current = unit[i]
    it(current.description, async () => {
      const fileName = tools.createPath()
      await fs.writeFile(fileName, Buffer.from([0x05, 0xfa, 0x6a, 0x63, 0xe0, 0x2e, 0xea, 0x92, 0x65, 0xf9]))
      const fileData = await srm.fileMethods.init(fileName, { eventEmitter })
      await expect(srm.fileMethods[current.function](fileData, { check: true, ...current.options })).toResolve()
      await fs.close(fileData.fd)
    })
  }
})

test.todo('wrong hash: modify file')

afterAll(async () => {
  tools.cleanup()
})
