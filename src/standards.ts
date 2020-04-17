import events from 'events'// eslint-disable-line
import * as file from './file'
import * as dir from './dir'
import * as disk from './disk'

export const standards = {
  mark: (settings: Settings) => {
    return {
      unlink: function (path: string, cb: (err: NodeJS.ErrnoException) => void) {
        const remove = async () => {
          await file.mark(path, settings)
        }
        // @ts-ignore
        remove().then(_ => cb(null)).catch(cb)
      },
      rmdir: function (path: string, cb: (err: NodeJS.ErrnoException) => void) {
        const remove = async () => {
          await dir.mark(path, settings)
        }
        // @ts-ignore
        remove().then(_ => cb(null)).catch(cb)
      }
    }
  },

  randomData: (settings: Settings) => {
    return {
      unlink: function (path: string, cb: (err: NodeJS.ErrnoException) => void) {
        const remove = async () => {
          const fileData = await file.init(path, settings)
          await file.random(fileData)
          await file.end(fileData)
        }
        // @ts-ignore
        remove().then(_ => cb(null)).catch(cb)
      }
    }
  },

  randomByte: (settings: Settings) => {
    return {
      unlink: function (path: string, cb: (err: NodeJS.ErrnoException) => void) {
        const remove = async () => {
          const fileData = await file.init(path, settings)
          await file.randomByte(fileData)
          await file.end(fileData)
        }
        // @ts-ignore
        remove().then(_ => cb(null)).catch(cb)
      }
    }
  },

  'NZSIT-402': (settings: Settings) => {
    return {
      unlink: function (path: string, cb: (err: NodeJS.ErrnoException) => void) {
        const remove = async () => {
          const fileData = await file.init(path, settings)
          await file.randomByte(fileData, { check: true })
          await file.end(fileData)
        }
        // @ts-ignore
        remove().then(_ => cb(null)).catch(cb)
      }
    }
  },

  zeros: (settings: Settings) => {
    return {
      unlink: function (path: string, cb: (err: NodeJS.ErrnoException) => void) {
        const remove = async () => {
          const fileData = await file.init(path, settings)
          await file.zeros(fileData)
          await file.end(fileData)
        }
        // @ts-ignore
        remove().then(_ => cb(null)).catch(cb)
      }
    }
  },

  ones: (settings: Settings) => {
    return {
      unlink: function (path: string, cb: (err: NodeJS.ErrnoException) => void) {
        const remove = async () => {
          const fileData = await file.init(path, settings)
          await file.ones(fileData)
          await file.end(fileData)
        }
        // @ts-ignore
        remove().then(_ => cb(null)).catch(cb)
      }
    }
  },

  secure: (settings: Settings) => {
    return {
      unlink: function (path: string, cb: (err: NodeJS.ErrnoException) => void) {
        const remove = async () => {
          let fileData = await file.init(path, settings)
          await file.random(fileData)
          fileData = await file.rename(fileData)
          await file.truncate(fileData)
          await file.resetTimestamps(fileData)
          await file.end(fileData)
        }
        // @ts-ignore
        remove().then(_ => cb(null)).catch(cb)
      },
      rmdir: function (path: string, cb: (err: NodeJS.ErrnoException) => void) {
        const remove = async () => {
          let folderData = await dir.init(path, settings)
          folderData = await dir.rename(folderData)
          await dir.end(folderData)
        }
        // @ts-ignore
        remove().then(_ => cb(null)).catch(cb)
      }
    }
  },

  'GOST_R50739-95': (settings: Settings) => {
    return {
      unlink: function (path: string, cb: (err: NodeJS.ErrnoException) => void) {
        const remove = async () => {
          const fileData = await file.init(path, settings)
          await file.zeros(fileData)
          await file.random(fileData)
          await file.end(fileData)
        }
        // @ts-ignore
        remove().then(_ => cb(null)).catch(cb)
      },
      wipe: async function (deviceData: disk.DeviceData) {
        await disk.zeros(deviceData, settings)
        await disk.random(deviceData, settings)
      }
    }
  },

  'HMG-IS5': (settings: Settings) => {
    return {
      unlink: function (path: string, cb: (err: NodeJS.ErrnoException) => void) {
        const remove = async () => {
          const fileData = await file.init(path, settings)
          await file.zeros(fileData)
          await file.ones(fileData)
          await file.random(fileData, { check: true })
          await file.end(fileData)
        }
        // @ts-ignore
        remove().then(_ => cb(null)).catch(cb)
      }
    }
  },

  'DOD 5220.22 M': (settings: Settings) => {
    return {
      unlink: function (path: string, cb: (err: NodeJS.ErrnoException) => void) {
        const remove = async () => {
          const fileData = await file.init(path, settings)
          await file.zeros(fileData, { check: true })
          await file.ones(fileData, { check: true })
          await file.random(fileData, { check: true })
          await file.end(fileData)
        }
        // @ts-ignore
        remove().then(_ => cb(null)).catch(cb)
      }
    }
  },

  'AR380-19': (settings: Settings) => {
    return {
      unlink: function (path: string, cb: (err: NodeJS.ErrnoException) => void) {
        const remove = async () => {
          const fileData = await file.init(path, settings)
          await file.random(fileData)
          await file.randomByte(fileData)
          await file.complementary(fileData)
          await file.end(fileData)
        }
        // @ts-ignore
        remove().then(_ => cb(null)).catch(cb)
      }
    }
  },

  VSITR: (settings: Settings) => {
    return {
      unlink: function (path: string, cb: (err: NodeJS.ErrnoException) => void) {
        const remove = async () => {
          const fileData = await file.init(path, settings)
          await file.zeros(fileData)
          await file.ones(fileData)
          await file.zeros(fileData)
          await file.ones(fileData)
          await file.zeros(fileData)
          await file.ones(fileData)
          await file.random(fileData)
          await file.end(fileData)
        }
        // @ts-ignore
        remove().then(_ => cb(null)).catch(cb)
      }
    }
  },

  schneier: (settings: Settings) => {
    return {
      unlink: function (path: string, cb: (err: NodeJS.ErrnoException) => void) {
        const remove = async () => {
          const fileData = await file.init(path, settings)
          await file.zeros(fileData)
          await file.ones(fileData)
          await file.random(fileData, { passes: 5 })
          await file.end(fileData)
        }
        // @ts-ignore
        remove().then(_ => cb(null)).catch(cb)
      }
    }
  },

  pfitzner: (settings: Settings) => {
    return {
      unlink: function (path: string, cb: (err: NodeJS.ErrnoException) => void) {
        const remove = async () => {
          const fileData = await file.init(path, settings)
          await file.random(fileData, { passes: 33 })
          await file.end(fileData)
        }
        // @ts-ignore
        remove().then(_ => cb(null)).catch(cb)
      }
    }
  },

  gutmann: (settings: Settings) => {
    return {
      unlink: function (path: string, cb: (err: NodeJS.ErrnoException) => void) {
        const remove = async () => {
          const fileData = await file.init(path, settings)
          await file.random(fileData, { passes: 4 })
          await file.byte(fileData, { data: 0x55 })
          await file.byte(fileData, { data: 0xAA })
          await file.byteArray(fileData, { data: [0x92, 0x49, 0x24] })
          await file.byteArray(fileData, { data: [0x49, 0x24, 0x92] })
          await file.byteArray(fileData, { data: [0x24, 0x92, 0x49] })
          await file.forByte(fileData, { initial: 0x00, condition: i => i < 0xFF, increment: i => i + 0x11 })
          await file.byteArray(fileData, { data: [0x92, 0x49, 0x24] })
          await file.byteArray(fileData, { data: [0x49, 0x24, 0x92] })
          await file.byteArray(fileData, { data: [0x24, 0x92, 0x49] })
          await file.byteArray(fileData, { data: [0x6D, 0xB6, 0xDB] })
          await file.byteArray(fileData, { data: [0xB6, 0xDB, 0x6D] })
          await file.byteArray(fileData, { data: [0xDB, 0x6D, 0xB6] })
          await file.random(fileData, { passes: 4 })
          await file.end(fileData)
        }
        // @ts-ignore
        remove().then(_ => cb(null)).catch(cb)
      }
    }
  }
}

export interface Settings {
  eventEmitter: events.EventEmitter
  maxCheckTries?: number
}
