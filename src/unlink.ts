import fs from 'fs-extra'
import path from 'path'
import util from 'util'
import crypto from 'crypto'
import { kMaxLength } from 'buffer'

export async function random ({ fd, fileSize }: FileData, { passes = 1 }: Options = {}) {
  for (let i = 0; i < passes; i++) {
    writeExtended(fd, fileSize, 0, async bufferSize => randomBytes(bufferSize))
  }
}

export async function zeros ({ fd, fileSize }: FileData, { passes = 1 }: Options = {}) {
  for (let i = 0; i < passes; i++) {
    writeExtended(fd, fileSize, 0, async bufferSize => Buffer.alloc(bufferSize, 0b00000000))
  }
}

export async function ones ({ fd, fileSize }: FileData, { passes = 1 }: Options = {}) {
  for (let i = 0; i < passes; i++) {
    writeExtended(fd, fileSize, 0, async bufferSize => Buffer.alloc(bufferSize, 0b11111111))
  }
}

export async function byte ({ fd, fileSize }: FileData, { passes = 1, data }: ByteOptions) {
  for (let i = 0; i < passes; i++) {
    writeExtended(fd, fileSize, 0, async bufferSize => Buffer.alloc(bufferSize, data))
  }
}

export async function byteArray ({ fd, fileSize }: FileData, { passes = 1, data }: ByteArrayOptions) {
  const dataConverted = Buffer.from(data)
  for (let i = 0; i < passes; i++) {
    writeExtended(fd, fileSize, 0, async bufferSize => Buffer.alloc(bufferSize, dataConverted))
  }
}

export async function forByte ({ fd, fileSize }: FileData, { initial, condition, increment }: ForByteOptions) {
  for (let i = initial; condition(i); i = increment(i)) {
    writeExtended(fd, fileSize, 0, async bufferSize => Buffer.alloc(bufferSize, i))
  }
}

export async function randomByte ({ fd, fileSize }: FileData, { passes = 1 }: Options = {}) {
  const data = (await randomBytes(1))[0]
  for (let i = 0; i < passes; i++) {
    writeExtended(fd, fileSize, 0, async bufferSize => Buffer.alloc(bufferSize, data))
  }
}

// complementary

export async function rename (fileName: string, { passes = 1 }: Options = {}) {
  for (let i = 0; i < passes; i++) {
    const newName = crypto.randomBytes(9).toString('base64').replace(/\//g, '0').replace(/\+/g, 'a')
    const newPath = path.join(path.dirname(fileName), newName)
    await fs.rename(fileName, newPath)
    fileName = newPath
  }
  return fileName
}

export async function truncate ({ fd, fileSize }: FileData, { passes = 1 }: Options = {}) {
  for (let i = 0; i < passes; i++) {
    const newSize = Math.floor((0.25 + Math.random() * 0.5 ) * fileSize)
    await fs.ftruncate(fd, newSize)
    fileSize = newSize
  }
}

export async function resetTimestamps ({ fd }: FileData) {
  return futimes(fd, new Date(0), new Date(0))
}

export async function randomTimestamps ({ fd }: FileData, { date1 = new Date(0), date2 = new Date() }: RandomTimestampsOptions = {}) {
  const date = new Date(randomValueBetween(date2.getTime(),date1.getTime()))
  return futimes(fd, date, date)
}

export async function unlink (fileName: string) {
  await fs.unlink(fileName)
}

export async function init (file: string) {
  const size = (await fs.stat(file)).size
  const fd = await fs.open(file, 'w')
  return { fd, size }
}

export async function end ({ fd }: FileData) {
  await fs.close(fd)
}

export async function writeExtended (fd: number, size: number, pos: number, getBuffer: (bufferSize: number) => Promise<Buffer>): Promise<void> {
  if (size - pos <= kMaxLength) {
    const data = await getBuffer(size)
    await fs.write(fd, data, pos)
    return Promise.resolve()
  }
  const data = await getBuffer(kMaxLength)
  await fs.write(fd, data, pos)
  return writeExtended(fd, size, pos + kMaxLength, getBuffer)
}

function randomValueBetween(min: number, max: number) {
  return Math.random() * (max - min) + min
}

const randomBytes = util.promisify(crypto.randomBytes)
const futimes = util.promisify(fs.futimes)

interface FileData {
  fd: number
  fileSize: number
}

interface Options {
  passes?: number
}

interface ByteOptions {
  passes?: number
  data: number
}

interface ByteArrayOptions {
  passes?: number
  data: number[]
}

interface ForByteOptions {
  initial: number
  condition: (i: number) => Boolean
  increment: (i: number) => number
}

interface RandomTimestampsOptions {
  date1?: Date
  date2?: Date
}
