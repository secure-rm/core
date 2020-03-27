import fs from 'fs-extra'
import * as file from './file'
import * as dir from './dir'

export const standards = {
  randomData: {
    unlink: function (path: string, cb: (err: NodeJS.ErrnoException) => void) {
      const remove = async () => {
        const fileData = await file.init(path)
        await file.random(fileData)
        await file.end(fileData)
      }
      // @ts-ignore
      remove().then(_=> cb(null)).catch(cb)
    }
  },

  randomByte: {
    unlink: function (path: string, cb: (err: NodeJS.ErrnoException) => void) {
      const remove = async () => {
        const fileData = await file.init(path)
        await file.randomByte(fileData)
        await file.end(fileData)
      }
      // @ts-ignore
      remove().then(_=> cb(null)).catch(cb)
    }
  },

  zeros: {
    unlink: function (path: string, cb: (err: NodeJS.ErrnoException) => void) {
      const remove = async () => {
        const fileData = await file.init(path)
        await file.zeros(fileData)
        await file.end(fileData)
      }
      // @ts-ignore
      remove().then(_=> cb(null)).catch(cb)
    }
  },

  ones: {
    unlink: function (path: string, cb: (err: NodeJS.ErrnoException) => void) {
      const remove = async () => {
        const fileData = await file.init(path)
        await file.ones(fileData)
        await file.end(fileData)
      }
      // @ts-ignore
      remove().then(_=> cb(null)).catch(cb)
    }
  },

  secure: {
    unlink: function (path: string, cb: (err: NodeJS.ErrnoException) => void) {
      const remove = async () => {
        let fileData = await file.init(path)
        await file.random(fileData)
        fileData = await file.rename(fileData)
        await file.truncate(fileData)
        await file.resetTimestamps(fileData)
        await file.end(fileData)
      }
      // @ts-ignore
      remove().then(_=> cb(null)).catch(cb)
    },
    rmdir: function (path: string, cb: (err: NodeJS.ErrnoException) => void) {
      const remove = async () => {
        path = await dir.rename(path)
        await fs.rmdir(path)
      }
      // @ts-ignore
      remove().then(_=> cb(null)).catch(cb)
    }
  },

  'GOST_R50739-95': {
    unlink: function (path: string, cb: (err: NodeJS.ErrnoException) => void) {
      const remove = async () => {
        const fileData = await file.init(path)
        await file.zeros(fileData)
        await file.random(fileData)
        await file.end(fileData)
      }
      // @ts-ignore
      remove().then(_=> cb(null)).catch(cb)
    }
  },
  HMG_IS5: {
    unlink: function (path: string, cb: (err: NodeJS.ErrnoException) => void) {
      const remove = async () => {
        const fileData = await file.init(path)
        await file.zeros(fileData)
        await file.ones(fileData)
        await file.random(fileData)
        await file.end(fileData)
      }
      // @ts-ignore
      remove().then(_=> cb(null)).catch(cb)
    }
  },

  'AR380-19': {
    unlink: function (path: string, cb: (err: NodeJS.ErrnoException) => void) {
      const remove = async () => {
        const fileData = await file.init(path)
        await file.random(fileData)
        await file.randomByte(fileData)
        await file.complementary(fileData)
        await file.end(fileData)
      }
      // @ts-ignore
      remove().then(_=> cb(null)).catch(cb)
    }
  },

  VSITR: {
    unlink: function (path: string, cb: (err: NodeJS.ErrnoException) => void) {
      const remove = async () => {
        const fileData = await file.init(path)
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
      remove().then(_=> cb(null)).catch(cb)
    }
  },

  schneier: {
    unlink: function (path: string, cb: (err: NodeJS.ErrnoException) => void) {
      const remove = async () => {
        const fileData = await file.init(path)
        await file.zeros(fileData)
        await file.ones(fileData)
        await file.random(fileData, { passes: 5 })
        await file.end(fileData)
      }
      // @ts-ignore
      remove().then(_=> cb(null)).catch(cb)
    }
  },

  pfitzner: {
    unlink: function (path: string, cb: (err: NodeJS.ErrnoException) => void) {
      const remove = async () => {
        const fileData = await file.init(path)
        await file.random(fileData, { passes: 33 })
        await file.end(fileData)
      }
      // @ts-ignore
      remove().then(_=> cb(null)).catch(cb)
    }
  },

  gutmann: {
    unlink: function (path: string, cb: (err: NodeJS.ErrnoException) => void) {
      const remove = async () => {
        const fileData = await file.init(path)
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
      remove().then(_=> cb(null)).catch(cb)
    }
  }
}


