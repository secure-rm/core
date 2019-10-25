import fs from 'fs'
import path from 'path'
import util from 'util'
import crypto from 'crypto'
import { kMaxLength } from 'buffer'
import { eventEmitter, eventError } from './events'

interface FileInfo {
  file: string
  fileSize: number
}

interface ForInterface {
  init: number
  condition: (i: number) => Boolean
  increment: (i: number) => number
}

type StepFunction = (file: string, fileSize: number) => Promise<FileInfo>

// Function to offset an array
// const offset = (arr: number[], offset: number) => [...arr.slice(offset), ...arr.slice(0, offset)]

export default class Unlink {
  private steps: Array<StepFunction>
  compile: typeof fs.unlink

  constructor () {
    this.steps = []
    this.compile = Object.assign(
      (file: fs.PathLike, callback: (err: NodeJS.ErrnoException | null) => void) => {
        this.steps.push((file: string, fileSize: number) => {
          return new Promise((resolve) => {
            callback(null)
            resolve({ file, fileSize })
          })
        })
        this.steps.reduce((prev: Promise<FileInfo>, next: StepFunction) => {
          return prev.then(({ file, fileSize }) => next(file, fileSize))
            .catch((err: NodeJS.ErrnoException) => {
              eventError(err, file as string)
              callback(err)
              return Promise.reject(err)
            })
        }, this.init(file as string))
          .catch((err: NodeJS.ErrnoException) => {
            eventError(err, file as string)
            callback(err)
          })
      },
      { __promisify__: util.promisify(fs.unlink) } // FIXME
    )
  }

  private init (file: string): Promise<FileInfo> {
    return new Promise((resolve, reject) => {
      fs.stat(file, (err, stats) => {
        if (err) reject(err)
        else if (stats.size <= kMaxLength) {
          eventEmitter.emit('start', file)
          resolve({ file, fileSize: stats.size })
        } else {
          reject(Error('64bit files are not yet supported.'))
        }
      })
    })
  }

  then (fun: StepFunction) {
    this.steps.push(fun)
    return this
  }

  log () {
    this.steps.push(
      function (file: string, fileSize: number) {
        return new Promise((resolve) => {
          const split = file.split(path.sep)
          console.log('┃ '.repeat(split.length - 1) + '┠─' + split[split.length - 1])
          resolve({ file, fileSize })
        })
      })
    return this
  }

  random (passes: number = 1) {
    this.steps = this.steps.concat(
      Array(passes).fill(
        function (file: string, fileSize: number) {
          return new Promise((resolve, reject) => {
            const buffer = Buffer.alloc(fileSize)
            crypto.randomFill(buffer, (err, randomBuffer) => {
              if (err) reject(err)
              eventEmitter.emit('verbose', file, 'Writing random data ')
              fs.writeFile(file, randomBuffer, (err) => {
                if (err) reject(err)
                resolve({ file, fileSize })
              })
            })
          })
        }))
    return this
  }

  zeroes (passes: number = 1) {
    this.steps = this.steps.concat(
      Array(passes).fill(
        function (file: string, fileSize: number) {
          return new Promise((resolve, reject) => {
            eventEmitter.emit('verbose', file, 'Writing zeroes ')
            fs.writeFile(file, Buffer.alloc(fileSize, 0b00000000), (err) => {
              if (err) reject(err)
              resolve({ file, fileSize })
            })
          })
        }))
    return this
  }

  ones (passes: number = 1) {
    this.steps = this.steps.concat(
      Array(passes).fill(
        function (file: string, fileSize: number) {
          return new Promise((resolve, reject) => {
            eventEmitter.emit('verbose', file, 'Writing ones ')
            fs.writeFile(file, Buffer.alloc(fileSize, 0b11111111), (err) => {
              if (err) reject(err)
              resolve({ file, fileSize })
            })
          })
        }))
    return this
  }

  // Write one byte on the whole file
  byte (data: number, passes: number = 1) {
    this.steps = this.steps.concat(
      Array(passes).fill(
        function (file: string, fileSize: number) {
          return new Promise((resolve, reject) => {
            eventEmitter.emit('verbose', file, `Writing 0x${data.toString(16)} `)
            fs.writeFile(file, Buffer.alloc(fileSize, data), (err) => {
              if (err) reject(err)
              resolve({ file, fileSize })
            })
          })
        }))
    return this
  }

  // Write an array of bytes on the whole file
  byteArray (dataArray: number[], passes: number = 1) {
    this.steps = this.steps.concat(
      Array(passes).fill(
        function (file: string, fileSize: number) {
          return new Promise((resolve, reject) => {
            eventEmitter.emit('verbose', file, `Writing ${dataArray.map(x => '0x' + x.toString(16))} `)
            const dataConverted = Buffer.from(dataArray)
            fs.writeFile(file, Buffer.alloc(fileSize, dataConverted), (err) => {
              if (err) reject(err)
              resolve({ file, fileSize })
            })
          })
        }))
    return this
  }

  // A for loop
  forByte ({ init, condition, increment }: ForInterface) {
    let i = init
    while (true) {
      if (!condition(i)) { break }
      const j = i // Fix the value (the following function could be called after the increment)
      this.steps.push(
        function (file: string, fileSize: number) {
          return new Promise((resolve, reject) => {
            eventEmitter.emit('verbose', file, `Writing 0x${j.toString(16)} `)
            fs.writeFile(file, Buffer.alloc(fileSize, j), (err) => {
              if (err) reject(err)
              resolve({ file, fileSize })
            })
          })
        })
      i = increment(i)
    }
    return this
  }

  randomByte (passes: number = 1) {
    this.steps = this.steps.concat(
      Array(passes).fill(
        function (file: string, fileSize: number) {
          return new Promise((resolve, reject) => {
            eventEmitter.emit('verbose', file, 'Writing random byte ')
            fs.writeFile(file, Buffer.alloc(fileSize, crypto.randomBytes(1)[0]), (err) => {
              if (err) reject(err)
              resolve({ file, fileSize })
            })
          })
        }))
    return this
  }

  // Write the binary complement
  complementary () {
    this.steps.push(
      function (file: string, fileSize: number) {
        return new Promise((resolve, reject) => {
          eventEmitter.emit('verbose', file, 'Reading file ')
          fs.readFile(file, (err, data) => {
            if (err) reject(err)
            else {
              eventEmitter.emit('verbose', file, 'Getting binary complement ')
              for (let i = 0, l = fileSize; i < l; i++) {
                data[i] = ~data[i]
              }
              eventEmitter.emit('verbose', file, 'Writing binary complement ')
              fs.writeFile(file, data, (err) => {
                if (err) reject(err)
                else resolve({ file, fileSize })
              })
            }
          })
        })
      })
    return this
  }

  // Rename to random string
  rename () {
    this.steps.push(
      function (file: string, fileSize: number) {
        return new Promise((resolve, reject) => {
          const newName = crypto.randomBytes(9).toString('base64').replace(/\//g, '0').replace(/\+/g, 'a')
          const newPath = path.join(path.dirname(file), newName)
          eventEmitter.emit('verbose', file, `Renaming to ${newName} `)
          fs.rename(file, newPath, (err) => {
            if (err) reject(err)
            else resolve({ file: newPath, fileSize })
          })
        })
      })
    return this
  }

  // Truncate to between 25% and 75% of the file size
  truncate () {
    this.steps.push(
      function (file: string, fileSize: number) {
        return new Promise((resolve, reject) => {
          eventEmitter.emit('verbose', file, 'Truncating ')
          const newSize = Math.floor((Math.random() * 0.5 + 0.25) * fileSize)
          fs.truncate(file, newSize, (err) => {
            if (err) reject(err)
            else resolve({ file, fileSize: newSize })
          })
        })
      })
    return this
  }

  // End function: unlink the file pointer
  unlink () {
    this.steps.push(
      function (file: string, fileSize: number) {
        return new Promise((resolve, reject) => {
          eventEmitter.emit('unlink', file)
          fs.unlink(file, (err) => {
            if (err) reject(err)
            else {
              eventEmitter.emit('done', file)
              resolve({ file, fileSize })
            }
          })
        })
      })
    return this.compile
  }

  /*
  template(passes: number = 1) {
    this.steps = this.steps.concat(
      Array(passes).fill(
        function (file: string, fileSize: number) {
          return
        }))
    return this
  }
  */

  /*
  template() {
    this.steps.push(
      function (file: string, fileSize: number) {
        return
      })
    return this
  }
  */
}
