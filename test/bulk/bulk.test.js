const fs = require('fs-extra')
const { kMaxLength } = require('buffer')
const srm = require('../../')

const tools = require('../tools')(__dirname, __filename)

it('Handles deep tree', async () => {
  const folderName = tools.createPath()
  tools.fill(100, 1, 1, folderName)
  expect(fs.statSync(folderName).isDirectory()).toBeTruthy()
  await srm.remove(folderName)
  expect(() => fs.statSync(folderName)).toThrow()
})

it('Handles large tree', async () => {
  const folderName = tools.createPath()
  tools.fill(2, 1000, 1, folderName)
  expect(fs.statSync(folderName).isDirectory()).toBeTruthy()
  await srm.remove(folderName)
  expect(() => fs.statSync(folderName)).toThrow()
})

jest.setTimeout(1000 * 60 * 5) // in milliseconds

const hugeFile = tools.createPath()

beforeAll(async () => {
  await fs.writeFile(hugeFile, Buffer.alloc(0))
  const fileData = await srm.fileMethods.init(hugeFile)
  await srm.fileMethods.writeExtended(fileData.fd, 2 * kMaxLength, 0, async bufferSize => Buffer.alloc(bufferSize, 0b00000000))
  await srm.fileMethods.end(fileData)
})

it('Handles large files (4Go on 64bit OS)', async () => {
  await srm.remove(hugeFile, { standard: srm.standards.zeros })
  const err = await fs.access(hugeFile, fs.constants.F_OK)
  expect(err).toBeNull()
})

afterAll(async () => {
  tools.cleanup()
})
