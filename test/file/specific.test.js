const fs = require('fs-extra')
const path = require('path')
const crypto = require('crypto')
const srm = require('../../')

const tools = require('../tools.js')(__dirname, __filename)

describe('Specific unlink functions are correct:', () => {
  it('Truncate between 25% and 75% of the file', async () => {
    const fileName = tools.createPath()
    await fs.writeFile(fileName, Buffer.from(Buffer.alloc(100, crypto.randomBytes(100))))
    const fileData = await srm.fileMethods.init(fileName)
    await srm.fileMethods.truncate(fileData)
    const fileSize = (await fs.stat(fileName)).size
    await srm.fileMethods.end(fileData)
    expect(fileSize).toBeGreaterThanOrEqual(25)
    expect(fileSize).toBeLessThanOrEqual(75)
  })

  it('Rename the file with a string of length 12', async () => {
    let fileName = tools.createPath()
    await fs.writeFile(fileName, Buffer.from(Buffer.alloc(100, crypto.randomBytes(100))))
    const fileData = await srm.fileMethods.init(fileName)
    fileName = await srm.fileMethods.rename(fileName)
    await srm.fileMethods.end(fileData)
    expect(path.basename(fileName)).toHaveLength(12)
  })

  it('Write a random byte along the file', async () => {
    const fileName = tools.createPath()
    await fs.writeFile(fileName, Buffer.from(Buffer.alloc(100, crypto.randomBytes(100))))
    const fileData = await srm.fileMethods.init(fileName)
    await srm.fileMethods.randomByte(fileData)
    await srm.fileMethods.end(fileData)
    const result = await fs.readFile(fileName)
    expect(result).toStrictEqual(Buffer.alloc(100, result[0]))
  })

  it('Reset file timestamps', async () => {
    const fileName = tools.createPath()
    await fs.writeFile(fileName, Buffer.from(Buffer.alloc(100, crypto.randomBytes(100))))
    const fileData = await srm.fileMethods.init(fileName)
    await srm.fileMethods.resetTimestamps(fileData)
    await srm.fileMethods.end(fileData)
    const { atime, mtime } = await fs.stat(fileName)
    expect(atime).toEqual(new Date(0))
    expect(mtime).toEqual(new Date(0))
  })
})

afterAll(async () => {
  tools.cleanup()
})
