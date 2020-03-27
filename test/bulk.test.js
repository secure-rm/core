const fs = require('fs-extra')
const { kMaxLength } = require('buffer')
const srm = require('..')

const tools = require('./tools')(__dirname, __filename)

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

it('Handles large files (above kMaxLength)', async () => {
  const fileName = tools.createPath()
  await fs.writeFile(fileName, Buffer.alloc(0))
  const fileData = await srm.fileMethods.init(fileName)
  await srm.fileMethods.writeExtended(fileData.fd, 2 * kMaxLength + 64, 0, async bufferSize => Buffer.alloc(bufferSize, 0b00000000))
  await srm.fileMethods.end(fileData)

  await srm.remove(fileName, { standard: srm.standards.zeros })
  expect(() => fs.statSync(fileName)).toThrow()
})

afterAll(async () => {
  tools.cleanup()
})
