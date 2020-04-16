const fs = require('fs-extra')
const path = require('path')
const crypto = require('crypto')
const events = require('events')
const srm = require('../../')

const tools = require('../tools')(__dirname, __filename)
const eventEmitter = new events.EventEmitter()

describe('Specific unlink functions are correct:', () => {
  it('Truncate between 25% and 75% of the file', async () => {
    const fileName = tools.createPath()
    await fs.writeFile(fileName, Buffer.from(Buffer.alloc(100, crypto.randomBytes(100))))
    const fileData = await srm.fileMethods.init(fileName, eventEmitter)
    await srm.fileMethods.truncate(fileData)
    const fileSize = (await fs.stat(fileName)).size
    await fs.close(fileData.fd)
    expect(fileSize).toBeGreaterThanOrEqual(25)
    expect(fileSize).toBeLessThanOrEqual(75)
  })

  it('Rename the file with a string of length 12', async () => {
    const fileName = tools.createPath()
    await fs.writeFile(fileName, Buffer.from(Buffer.alloc(100, crypto.randomBytes(100))))
    let fileData = await srm.fileMethods.init(fileName, eventEmitter)
    fileData = await srm.fileMethods.rename(fileData)
    await fs.close(fileData.fd)
    expect(path.basename(fileData.fileName)).toHaveLength(12)
  })

  it('Write random data', async () => {
    const fileName = tools.createPath()
    await fs.writeFile(fileName, Buffer.from(Buffer.alloc(100, crypto.randomBytes(100))))
    const fileData = await srm.fileMethods.init(fileName, eventEmitter)
    await srm.fileMethods.random(fileData)
    await fs.close(fileData.fd)
    const result = await fs.readFile(fileName)
    expect(result).not.toStrictEqual(Buffer.alloc(100, 0))
  })

  it('Write a random byte along the file', async () => {
    const fileName = tools.createPath()
    await fs.writeFile(fileName, Buffer.from(Buffer.alloc(100, crypto.randomBytes(100))))
    const fileData = await srm.fileMethods.init(fileName, eventEmitter)
    await srm.fileMethods.randomByte(fileData)
    await fs.close(fileData.fd)
    const result = await fs.readFile(fileName)
    expect(result).toStrictEqual(Buffer.alloc(100, result[0]))
  })

  it('Reset file timestamps', async () => {
    const fileName = tools.createPath()
    await fs.writeFile(fileName, Buffer.from(Buffer.alloc(100, crypto.randomBytes(100))))
    const fileData = await srm.fileMethods.init(fileName, eventEmitter)
    await srm.fileMethods.resetTimestamps(fileData)
    await fs.close(fileData.fd)
    const { atime, mtime } = await fs.stat(fileName)
    expect(atime).toEqual(new Date(0))
    expect(mtime).toEqual(new Date(0))
  })

  it('Randomize file timestamps', async () => {
    const fileName = tools.createPath()
    await fs.writeFile(fileName, Buffer.from(Buffer.alloc(100, crypto.randomBytes(100))))
    const fileData = await srm.fileMethods.init(fileName, eventEmitter)
    await srm.fileMethods.changeTimestamps(fileData)
    await fs.close(fileData.fd)
    const { atime, mtime } = await fs.stat(fileName)
    expect(atime.getTime()).toBeGreaterThanOrEqual(new Date(0).getTime())
    expect(atime.getTime()).toBeLessThanOrEqual(new Date().getTime())
    expect(mtime.getTime()).toBeGreaterThanOrEqual(new Date(0).getTime())
    expect(mtime.getTime()).toBeLessThanOrEqual(new Date().getTime())
  })

  it('Randomize file timestamps in an interval', async () => {
    const date1 = new Date(2015, 11, 17)
    const date2 = new Date(2015, 11, 20)
    const fileName = tools.createPath()
    await fs.writeFile(fileName, Buffer.from(Buffer.alloc(100, crypto.randomBytes(100))))
    const fileData = await srm.fileMethods.init(fileName, eventEmitter)
    await srm.fileMethods.changeTimestamps(fileData, { date1, date2 })
    await fs.close(fileData.fd)
    const { atime, mtime } = await fs.stat(fileName)
    expect(atime.getTime()).toBeGreaterThanOrEqual(date1.getTime())
    expect(atime.getTime()).toBeLessThanOrEqual(date2.getTime())
    expect(mtime.getTime()).toBeGreaterThanOrEqual(date1.getTime())
    expect(mtime.getTime()).toBeLessThanOrEqual(date2.getTime())
  })

  it('Mark the file', async () => {
    const fileName = tools.createPath()
    await fs.writeFile(fileName, Buffer.from(Buffer.alloc(100, crypto.randomBytes(100))))
    let count = 0
    eventEmitter.on('mark', () => {
      count++
    })
    await srm.fileMethods.mark(fileName, eventEmitter)
    expect(count).toStrictEqual(1)
  })
})

afterAll(async () => {
  tools.cleanup()
})
