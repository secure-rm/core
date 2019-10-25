const fs = require('fs')
const util = require('util')
const srm = require('../../')

const { target, tools } = require('../tools.js')(__dirname, __filename)

const readFile = util.promisify(fs.readFile)
const writeFile = util.promisify(fs.writeFile)

try {
  fs.mkdirSync(target)
} catch {
  console.log(target + ' already exists')
}

const expected = [
  {
    function: 'zeroes',
    description: 'Write zeroes: 0x00',
    expectedValue: Buffer.from([0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00])
  },
  {
    function: 'ones',
    description: 'Write ones: 0xff',
    expectedValue: Buffer.from([0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff])
  },
  {
    function: 'complementary',
    description: 'Write binary complement',
    expectedValue: Buffer.from([0xfa, 0x05, 0x95, 0x9c, 0x1f, 0xd1, 0x15, 0x6d, 0x9a, 0x06])
  },
  {
    function: 'byte',
    description: 'Write a byte: 0x22',
    arg: 0x22,
    expectedValue: Buffer.from([0x22, 0x22, 0x22, 0x22, 0x22, 0x22, 0x22, 0x22, 0x22, 0x22])
  },
  {
    function: 'byte',
    description: 'Write a byte: 0xab',
    arg: 0xab,
    expectedValue: Buffer.from([0xab, 0xab, 0xab, 0xab, 0xab, 0xab, 0xab, 0xab, 0xab, 0xab])
  },
  {
    function: 'byteArray',
    description: 'Write bytes array: [0x76, 0x6d, 0x3b]',
    arg: [0x76, 0x6d, 0x3b],
    expectedValue: Buffer.from([0x76, 0x6d, 0x3b, 0x76, 0x6d, 0x3b, 0x76, 0x6d, 0x3b, 0x76])
  },
  {
    function: 'forByte',
    description: 'Increment by 0x11 from 0x00 to 0xee',
    arg: {
      init: 0x00,
      condition: i => i < 0xff,
      increment: i => i + 0x11
    },
    expectedValue: Buffer.from([0xee, 0xee, 0xee, 0xee, 0xee, 0xee, 0xee, 0xee, 0xee, 0xee])
  },
  {
    function: 'forByte',
    description: 'Increment by 0x10 from 0x00 to 0x45: should not increment past 0x40',
    arg: {
      init: 0x00,
      condition: i => i < 0x45,
      increment: i => i + 0x10
    },
    expectedValue: Buffer.from([0x40, 0x40, 0x40, 0x40, 0x40, 0x40, 0x40, 0x40, 0x40, 0x40])
  }
]

describe('Non-random unlink functions are correct:', () => {
  for (let i = 0; i < expected.length; i++) {
    it(expected[i].description, done => {
      const fileName = tools.createPath()
      writeFile(fileName, Buffer.from([0x05, 0xfa, 0x6a, 0x63, 0xe0, 0x2e, 0xea, 0x92, 0x65, 0xf9]))
        .then(() => srm(fileName, {
          customStandard: new srm.Standard({
            unlinkStandard: new srm.Unlink()[expected[i].function](expected[i].arg)
              .compile
          })
        }))
        .then(() => readFile(fileName))
        .then((result) => {
          expect(result).toStrictEqual(expected[i].expectedValue)
          done()
        })
        .catch((err) => { throw err })
    })
  }
})

afterAll(done => {
  tools.cleanup(done)
})
