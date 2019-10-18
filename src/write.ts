import fs from 'fs'
import path from 'path'
import events from 'events'
import crypto from 'crypto'
// import { kMaxLength } from 'buffer' // BUG kMaxLength undefined in typescript

const eventEmitter = new events.EventEmitter()

// Function to offset an array
const offset = (arr: number[], offset: number) => [...arr.slice(offset), ...arr.slice(0, offset)]

interface FileInfo {
  file: string
  fileSize: number
}

interface ForInterface {
  start: number
  end: number
  increment: number
}

// Object listing writing methods
const write = {
  // Needed to provide file size
  init: (file: string): Promise<FileInfo> => {
    return new Promise((resolve, reject) => {
      fs.stat(file, (err, stats) => {
        if (err) reject(err)
        else if (stats.size <= /* kMaxLength */ (2 ** 31) - 1) {
          eventEmitter.emit('start', file)
          resolve({ file, fileSize: stats.size })
        } else {
          reject(Error('64bit files are not yet supported.'))
        }
      })
    })
  },
  random: (file: string, fileSize: number, passes: number = 1): Promise<FileInfo> => {
    return new Promise((resolve, reject) => {
      const buffer = Buffer.alloc(fileSize)
      crypto.randomFill(buffer, (err, randomBuffer) => {
        if (err) reject(err)
        eventEmitter.emit('verbose', file, 'Writing random data ')
        fs.writeFile(file, randomBuffer, (err) => {
          if (err) reject(err)
          else if (passes > 1) {
            write.random(file, fileSize, passes - 1)
              .then(() => resolve({ file, fileSize }))
              .catch((err) => reject(err))
          } else resolve({ file, fileSize })
        })
      })
    })
  },
  zeroes: (file: string, fileSize: number, passes: number = 1): Promise<FileInfo> => {
    return new Promise((resolve, reject) => {
      eventEmitter.emit('verbose', file, 'Writing zeroes ')
      fs.writeFile(file, Buffer.alloc(fileSize, 0b00000000), (err) => {
        if (err) reject(err)
        else if (passes > 1) {
          write.zeroes(file, fileSize, passes - 1)
            .then(() => resolve({ file, fileSize }))
            .catch((err) => reject(err))
        } else resolve({ file, fileSize })
      })
    })
  },
  ones: (file: string, fileSize: number, passes: number = 1): Promise<FileInfo> => {
    return new Promise((resolve, reject) => {
      eventEmitter.emit('verbose', file, 'Writing ones ')
      fs.writeFile(file, Buffer.alloc(fileSize, 0b11111111), (err) => {
        if (err) reject(err)
        else if (passes > 1) {
          write.ones(file, fileSize, passes - 1)
            .then(() => resolve({ file, fileSize }))
            .catch((err) => reject(err))
        } else resolve({ file, fileSize })
      })
    })
  },
  // Write one byte on the whole file
  byte: (file: string, data: number, fileSize: number, passes: number = 1): Promise<FileInfo> => {
    return new Promise((resolve, reject) => {
      eventEmitter.emit('verbose', file, `Writing 0x${data.toString(16)} `)
      fs.writeFile(file, Buffer.alloc(fileSize, data), (err) => {
        if (err) reject(err)
        else if (passes > 1) {
          write.byte(file, data, fileSize, passes - 1)
            .then(() => resolve({ file, fileSize }))
            .catch((err) => reject(err))
        } else resolve({ file, fileSize })
      })
    })
  },
  // Write an array of bytes on the whole file
  bytes: (file: string, dataArray: number[], fileSize: number, passes: number = 1): Promise<FileInfo> => {
    return new Promise((resolve, reject) => {
      eventEmitter.emit('verbose', file, `Writing ${dataArray.map(x => '0x' + x.toString(16))} `)
      // const dataConverted = Uint8Array.from(dataArray)
      const dataConverted = Buffer.from(dataArray)
      fs.writeFile(file, Buffer.alloc(fileSize, dataConverted), (err) => {
        if (err) reject(err)
        else if (passes > 1) {
          write.bytes(file, dataArray, fileSize, passes - 1)
            .then(() => resolve({ file, fileSize }))
            .catch((err) => reject(err))
        } else resolve({ file, fileSize })
      })
    })
  },
  // Write an array of bytes on the whole file
  // And then cycle through the array
  cycleBytes: (file: string, dataArray: number[], fileSize: number, passes: number = 1): Promise<FileInfo> => {
    return new Promise((resolve, reject) => {
      eventEmitter.emit('verbose', file, `Writing ${dataArray.map(x => '0x' + x.toString(16))} `)
      // const dataConverted = Uint8Array.from(dataArray)
      const dataConverted = Buffer.from(dataArray)
      fs.writeFile(file, Buffer.alloc(fileSize, dataConverted), (err) => {
        if (err) reject(err)
        else if (passes < dataArray.length) {
          write.cycleBytes(file, offset(dataArray, 1), fileSize, passes + 1)
            .then(() => resolve({ file, fileSize }))
            .catch((err) => reject(err))
        } else resolve({ file, fileSize })
      })
    })
  },
  // Write start byte on the whole file
  // And then + increment until end byte
  incrementByte: (file: string, { start, end, increment }: ForInterface, fileSize: number): Promise<FileInfo> => {
    return new Promise((resolve, reject) => {
      eventEmitter.emit('verbose', file, `Writing 0x${start.toString(16)} `)
      fs.writeFile(file, Buffer.alloc(fileSize, start), (err) => {
        if (err) reject(err)
        else if (start + increment <= end) {
          write.incrementByte(file, { start: start + increment, end: end, increment }, fileSize)
            .then(() => resolve({ file, fileSize }))
            .catch((err) => reject(err))
        } else resolve({ file, fileSize })
      })
    })
  },
  randomByte: (file: string, fileSize: number, passes: number = 1): Promise<FileInfo> => {
    return new Promise((resolve, reject) => {
      eventEmitter.emit('verbose', file, 'Writing random byte ')
      fs.writeFile(file, Buffer.alloc(fileSize, crypto.randomBytes(1)[0]), (err) => {
        if (err) reject(err)
        else if (passes > 1) {
          write.randomByte(file, fileSize, passes - 1)
            .then(() => resolve({ file, fileSize }))
            .catch((err) => reject(err))
        } else resolve({ file, fileSize })
      })
    })
  },
  // Write the binary complement
  complementary: (file: string, fileSize: number): Promise<FileInfo> => {
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
  },
  // Rename to random string
  rename: (file: string, fileSize: number): Promise<FileInfo> => {
    return new Promise((resolve, reject) => {
      const newName = crypto.randomBytes(9).toString('base64').replace(/\//g, '0').replace(/\+/g, 'a')
      const newPath = path.join(path.dirname(file), newName)
      eventEmitter.emit('verbose', file, `Renaming to ${newName} `)
      fs.rename(file, newPath, (err) => {
        if (err) reject(err)
        else resolve({ file: newPath, fileSize })
      })
    })
  },
  // Truncate to between 25% and 75% of the file size
  truncate: (file: string, fileSize: number): Promise<FileInfo> => {
    return new Promise((resolve, reject) => {
      eventEmitter.emit('verbose', file, 'Truncating ')
      const newSize = Math.floor((Math.random() * 0.5 + 0.25) * fileSize)
      fs.truncate(file, newSize, (err) => {
        if (err) reject(err)
        else resolve({ file, fileSize: newSize })
      })
    })
  },
  // End function: unlink the file pointer
  unlink: (file: string): Promise<void> => {
    return new Promise((resolve, reject) => {
      eventEmitter.emit('unlink', file)
      fs.unlink(file, (err) => {
        if (err) reject(err)
        else {
          eventEmitter.emit('done', file)
          resolve()
        }
      })
    })
  }
}

export { write, eventEmitter }
