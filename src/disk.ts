import imageWrite from 'etcher-image-write'
import fs from 'fs-extra'
import crypto from 'crypto'
import stream from 'stream'

class DataStream extends stream.Readable {
  deviceSize: number
  pos: number
  chunkSize: number
  getBuffer: GetBuffer
  constructor (opt: DataStreamOptions) {
    super(opt)
    this.deviceSize = opt.deviceSize
    this.pos = 0
    this.chunkSize = opt.chunkSize
    this.getBuffer = opt.getBuffer
  }

  _read () {
    if (this.deviceSize - this.pos <= this.chunkSize) {
      const data = this.getBuffer(this.deviceSize - this.pos, this.pos)
      this.push(data)
      this.push(null)
    } else {
      const data = this.getBuffer(this.chunkSize, this.pos)
      this.push(data)
      this.pos += this.chunkSize
    }
  }
}

export async function random (deviceData: DeviceData, { check = false, passes = 1 } = {}) {
  for (let i = 0; i < passes; i++) {
    await overwriteExtended(deviceData, bufferSize => crypto.randomBytes(bufferSize), check)
  }
}

export async function zeros (deviceData: DeviceData, { check = false, passes = 1 } = {}) {
  for (let i = 0; i < passes; i++) {
    await overwriteExtended(deviceData, bufferSize => Buffer.alloc(bufferSize, 0b00000000), check)
  }
}

export async function ones (deviceData: DeviceData, { check = false, passes = 1 } = {}) {
  for (let i = 0; i < passes; i++) {
    await overwriteExtended(deviceData, bufferSize => Buffer.alloc(bufferSize, 0b11111111), check)
  }
}

export async function byte (deviceData: DeviceData, { check = false, passes = 1, data }: ByteOptions) {
  for (let i = 0; i < passes; i++) {
    await overwriteExtended(deviceData, bufferSize => Buffer.alloc(bufferSize, data), check)
  }
}

export async function byteArray (deviceData: DeviceData, { check = false, passes = 1, data }: ByteArrayOptions) {
  const dataConverted = Buffer.from(data)
  for (let i = 0; i < passes; i++) {
    await overwriteExtended(deviceData, bufferSize => Buffer.alloc(bufferSize, dataConverted), check)
  }
}

export async function forByte (deviceData: DeviceData, { check = false, initial, condition, increment }: ForByteOptions) {
  for (let i = initial; condition(i); i = increment(i)) {
    await overwriteExtended(deviceData, bufferSize => Buffer.alloc(bufferSize, i), check)
  }
}

export async function randomByte (deviceData: DeviceData, { check = false, passes = 1 } = {}) {
  const data = crypto.randomBytes(1)[0]
  for (let i = 0; i < passes; i++) {
    await overwriteExtended(deviceData, bufferSize => Buffer.alloc(bufferSize, data), check)
  }
}

function overwriteExtended ({ device, deviceSize, chunkSize }: DeviceData, getBuffer: GetBuffer, check: boolean) {
  return new Promise((resolve, reject) => {
    const emitter = imageWrite.write({
      fd: fs.openSync(device, 'rs+'),
      device,
      size: deviceSize
    }, {
      stream: new DataStream({ deviceSize, chunkSize, getBuffer }),
      size: deviceSize
    }, {
      check
    })

    emitter.on('progress', (state: Progress) => {
      console.log(state)
    })

    emitter.on('error', (error: NodeJS.ErrnoException) => {
      reject(error)
    })

    emitter.on('done', () => {
      console.log('Success!')
      resolve()
    })
  })
}

interface Options {
  check?: boolean
  passes?: number
}

interface ByteOptions extends Options {
  data: number
}

interface ByteArrayOptions extends Options {
  data: number[]
}

interface ForByteOptions {
  check?: boolean
  initial: number
  condition: (i: number) => boolean
  increment: (i: number) => number
}

type GetBuffer = (bufferSize: number, pos: number) => Buffer

export interface DeviceData {
  device: string
  deviceSize: number
  chunkSize: number
}

interface DataStreamOptions extends stream.ReadableOptions {
  deviceSize: number
  chunkSize: number
  getBuffer: GetBuffer
}

interface Progress {
  type: 'write' | 'check'
  percentage: number
  transferred: number
  length: number
  remaining: number
  eta: number
  runtime: number
  delta: number
  speed: number
}
