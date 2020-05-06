import events from 'events'// eslint-disable-line
import util from 'util'
import crypto from 'crypto'
import * as file from './file'
import * as dir from './dir'
// import * as disk from './disk'

export const standards = {
  mark: (settings: StandardSettings) => {
    return {
      description: 'Returns targeted files without deleting them.',
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
      }/* ,
      wipe: async function (deviceData: disk.DeviceData) {
        throw new WipeError('mark')
      } */
    }
  },

  randomData: (settings: StandardSettings) => {
    return {
      description: 'Pass 1: Your data is overwritten with cryptographically strong pseudo-random data. (The data is indistinguishable from random noise.)',
      unlink: function (path: string, cb: (err: NodeJS.ErrnoException) => void) {
        const remove = async () => {
          const fileData = await file.init(path, settings)
          await file.random(fileData)
          await file.end(fileData)
        }
        // @ts-ignore
        remove().then(_ => cb(null)).catch(cb)
      }/* ,
      wipe: async function (deviceData: disk.DeviceData) {
        await disk.random(deviceData, settings)
      } */
    }
  },

  randomByte: (settings: StandardSettings) => {
    return {
      description: 'Pass 1: Overwriting the data with a random character.',
      unlink: function (path: string, cb: (err: NodeJS.ErrnoException) => void) {
        const remove = async () => {
          const fileData = await file.init(path, settings)
          await file.randomByte(fileData)
          await file.end(fileData)
        }
        // @ts-ignore
        remove().then(_ => cb(null)).catch(cb)
      }/* ,
      wipe: async function (deviceData: disk.DeviceData) {
        await disk.randomByte(deviceData, settings)
      } */
    }
  },

  zeros: (settings: StandardSettings) => {
    return {
      description: 'Pass 1: Overwriting the data with a zero.',
      unlink: function (path: string, cb: (err: NodeJS.ErrnoException) => void) {
        const remove = async () => {
          const fileData = await file.init(path, settings)
          await file.zeros(fileData)
          await file.end(fileData)
        }
        // @ts-ignore
        remove().then(_ => cb(null)).catch(cb)
      }/* ,
      wipe: async function (deviceData: disk.DeviceData) {
        await disk.zeros(deviceData, settings)
      } */
    }
  },

  ones: (settings: StandardSettings) => {
    return {
      description: 'Pass 1: Overwriting the data with a one.',
      unlink: function (path: string, cb: (err: NodeJS.ErrnoException) => void) {
        const remove = async () => {
          const fileData = await file.init(path, settings)
          await file.ones(fileData)
          await file.end(fileData)
        }
        // @ts-ignore
        remove().then(_ => cb(null)).catch(cb)
      }/* ,
      wipe: async function (deviceData: disk.DeviceData) {
        await disk.ones(deviceData, settings)
      } */
    }
  },

  secure: (settings: StandardSettings) => {
    return {
      description: `**SECURE-RM STANDARD**
        Pass 1: Overwriting the data with cryptographically strong pseudo-random data as well as verifying the writing of the data;
        Then : Renaming the file with random data;
        Then : Truncating between 25% and 75% of the file;
        Then : Resetting file timestamps to 1970-01-01T00:00:00.000Z.`,
      unlink: function (path: string, cb: (err: NodeJS.ErrnoException) => void) {
        const remove = async () => {
          let fileData = await file.init(path, settings)
          await file.random(fileData, { check: true })
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
      }/* ,
      wipe: async function (deviceData: disk.DeviceData) {
        await disk.random(deviceData, settings, { check: true })
      } */
    }
  },

  'NZSIT-402': (settings: StandardSettings) => {
    return {
      description: `**NEW ZEALAND INFORMATION AND COMMUNICATIONS TECHNOLOGY STANDARD NZSIT 402**
        Pass 1: Overwriting the data with a random character as well as verifying the writing of this character.`,
      unlink: function (path: string, cb: (err: NodeJS.ErrnoException) => void) {
        const remove = async () => {
          const fileData = await file.init(path, settings)
          await file.randomByte(fileData, { check: true })
          await file.end(fileData)
        }
        // @ts-ignore
        remove().then(_ => cb(null)).catch(cb)
      }/* ,
      wipe: async function (deviceData: disk.DeviceData) {
        await disk.randomByte(deviceData, settings)
      } */
    }
  },

  'ISM-6.2.92': (settings: StandardSettings) => {
    return {
      description: `**AUSTRALIAN INFORMATION SECURITY MANUAL STANDARD ISM 6.2.92**
        Pass 1: Overwriting the data with a random character as well as verifying the writing of this character.
        It is worth mentioning that the ISM 6.2.92 overwrites a drive with a size of less than 15 GB by a three-time overwriting with a random character.`,
      unlink: function (path: string, cb: (err: NodeJS.ErrnoException) => void) {
        const remove = async () => {
          const fileData = await file.init(path, settings)
          await file.randomByte(fileData, { check: true })
          await file.end(fileData)
        }
        // @ts-ignore
        remove().then(_ => cb(null)).catch(cb)
      }/* ,
      wipe: async function (deviceData: disk.DeviceData) {
        if (deviceData.deviceSize < 15 * 1024 * 1024 * 1024) {
          await disk.randomByte(deviceData, settings, { passes: 3 })
        } else {
          await disk.randomByte(deviceData, settings)
        }
      } */
    }
  },

  'GOST_R50739-95': (settings: StandardSettings) => {
    return {
      description: `**RUSSIAN STATE STANDARD GOST R 50739-95 (RUSSIAN: ГОСТ P 50739-95)**
        Pass 1: Overwriting the data with a zero;
        Pass 2: Overwriting the data with a random character.`,
      unlink: function (path: string, cb: (err: NodeJS.ErrnoException) => void) {
        const remove = async () => {
          const fileData = await file.init(path, settings)
          await file.zeros(fileData)
          await file.randomByte(fileData)
          await file.end(fileData)
        }
        // @ts-ignore
        remove().then(_ => cb(null)).catch(cb)
      }/* ,
      wipe: async function (deviceData: disk.DeviceData) {
        await disk.zeros(deviceData, settings)
        await disk.randomByte(deviceData, settings)
      } */
    }
  },

  'AFSSI-5020': (settings: StandardSettings) => {
    return {
      description: `**AIR FORCE SYSTEM SECURITY INSTRUCTIONS AFSSI-5020**
        Pass 1: Overwriting the data with a zero;
        Pass 2: Overwriting the data with a one;
        Pass 3: Overwriting the data with a random character as well as verifying the writing of this character.`,
      unlink: function (path: string, cb: (err: NodeJS.ErrnoException) => void) {
        const remove = async () => {
          const fileData = await file.init(path, settings)
          await file.zeros(fileData)
          await file.ones(fileData)
          await file.randomByte(fileData, { check: true })
          await file.end(fileData)
        }
        // @ts-ignore
        remove().then(_ => cb(null)).catch(cb)
      }/* ,
      wipe: async function (deviceData: disk.DeviceData) {
        await disk.zeros(deviceData, settings)
        await disk.ones(deviceData, settings)
        await disk.randomByte(deviceData, settings, { check: true })
      } */
    }
  },

  'HMG-IS5': (settings: StandardSettings) => {
    return {
      ...standards['AFSSI-5020'](settings),
      description: `**BRITISH HMG INFOSEC STANDARD 5**
        Pass 1: Overwriting the data with a zero;
        Pass 2: Overwriting the data with a one;
        Pass 3: Overwriting the data with a random character as well as verifying the writing of this character.`
    }
  },

  'CSEC_ITSG-06': (settings: StandardSettings) => {
    return {
      description: `**COMMUNICATION SECURITY ESTABLISHMENT CANADA STANDARD CSEC ITSG-06**
        Pass 1: Overwriting the data with a zero or a one;
        Pass 2: Overwriting the data with the opposite sign (if in the first pass a one, then zero is used, if in the first pass a zero, then one is used);
        Pass 3: Overwriting the data with a random character as well as verifying the writing of this character.`,
      unlink: function (path: string, cb: (err: NodeJS.ErrnoException) => void) {
        const remove = async () => {
          const fileData = await file.init(path, settings)
          const bool = (await randomBytes(1))[0] < 128
          if (bool) {
            await file.zeros(fileData)
            await file.ones(fileData)
          } else {
            await file.ones(fileData)
            await file.zeros(fileData)
          }
          await file.randomByte(fileData, { check: true })
          await file.end(fileData)
        }
        // @ts-ignore
        remove().then(_ => cb(null)).catch(cb)
      }/* ,
      wipe: async function (deviceData: disk.DeviceData) {
        const bool = (await randomBytes(1))[0] < 128
        if (bool) {
          await disk.zeros(deviceData, settings)
          await disk.ones(deviceData, settings)
        } else {
          await disk.ones(deviceData, settings)
          await disk.zeros(deviceData, settings)
        }
        await disk.randomByte(deviceData, settings, { check: true })
      } */
    }
  },

  'NAVOS_5239-26': (settings: StandardSettings) => {
    return {
      ...standards['CSEC_ITSG-06'](settings),
      description: `**NAVY STAFF OFFICE PUBLICATION NAVSO P-5239-26**
        Pass 1: Overwriting the data with a defined character (e.g., one);
        Pass 2: Overwriting the data with the opposite of the defined character (e.g., zero);
        Pass 3: Overwriting the data with a random character as well as verifying the writing of this character.`
    }
  },

  'DOD_5220.22 M': (settings: StandardSettings) => {
    return {
      description: `**STANDARD OF THE AMERICAN DEPARTMENT OF DEFENSE (DOD 5220.22 M)**
        Pass 1: Overwriting the data with a zero as well as checking the writing of this character;
        Pass 2: Overwriting the data with a one and checking the writing of this character;
        Pass 3: Overwriting the data with a random character as well as verifying the writing of this character.`,
      unlink: function (path: string, cb: (err: NodeJS.ErrnoException) => void) {
        const remove = async () => {
          const fileData = await file.init(path, settings)
          await file.zeros(fileData, { check: true })
          await file.ones(fileData, { check: true })
          await file.randomByte(fileData, { check: true })
          await file.end(fileData)
        }
        // @ts-ignore
        remove().then(_ => cb(null)).catch(cb)
      }/* ,
      wipe: async function (deviceData: disk.DeviceData) {
        await disk.zeros(deviceData, settings, { check: true })
        await disk.ones(deviceData, settings, { check: true })
        await disk.randomByte(deviceData, settings, { check: true })
      } */
    }
  },

  'NCSC-TG-025': (settings: StandardSettings) => {
    return {
      ...standards['DOD_5220.22 M'](settings),
      description: `**NATIONAL COMPUTER SECURITY CENTER NCSC-TG-025 STANDARD**
        Pass 1: Overwriting the data with a zero as well as verifying the writing of this character;
        Pass 2: Overwriting the data with a one and verifying the writing of this character;
        Pass 3: Overwriting the data with a random character as well as verifying the writing of this character.`
    }
  },

  'AR380-19': (settings: StandardSettings) => {
    return {
      description: `**U.S. ARMY AR380-19**
        Pass 1: Overwriting the data with a random character;
        Pass 2: Overwriting the data with a defined character (e.g., zero);
        Pass 3: Overwriting the data with the opposite of the random character (e.g., one), and verifying the writing of that character.`,
      unlink: function (path: string, cb: (err: NodeJS.ErrnoException) => void) {
        const remove = async () => {
          const fileData = await file.init(path, settings)
          await file.randomByte(fileData)
          const byte = (await randomBytes(1))[0]
          await file.byte(fileData, { data: byte })
          await file.byte(fileData, { data: ~byte, check: true })
          await file.end(fileData)
        }
        // @ts-ignore
        remove().then(_ => cb(null)).catch(cb)
      }/* ,
      wipe: async function (deviceData: disk.DeviceData) {
        await disk.randomByte(deviceData, settings)
        const byte = (await randomBytes(1))[0]
        await disk.byte(deviceData, settings, { data: byte })
        await disk.byte(deviceData, settings, { data: ~byte, check: true })
      } */
    }
  },

  'RCMP_TSSIT_OPS-II': (settings: StandardSettings) => {
    return {
      description: `**ROYAL CANADIAN MOUNTED POLICE TSSIT OPS-II**
        Pass 1: Overwriting the data with a zero;
        Pass 2: Overwriting the data with a one;
        Pass 3-6: Same as 1-2;
        Pass 7: Overwriting the data with a random character as well as review the writing of this character.`,
      unlink: function (path: string, cb: (err: NodeJS.ErrnoException) => void) {
        const remove = async () => {
          const fileData = await file.init(path, settings)
          for (let i = 0; i < 3; i++) {
            await file.zeros(fileData)
            await file.ones(fileData)
          }
          await file.randomByte(fileData, { check: true })
          await file.end(fileData)
        }
        // @ts-ignore
        remove().then(_ => cb(null)).catch(cb)
      }/* ,
      wipe: async function (deviceData: disk.DeviceData) {
        for (let i = 0; i < 3; i++) {
          await disk.zeros(deviceData, settings)
          await disk.ones(deviceData, settings)
        }
        await disk.randomByte(deviceData, settings, { check: true })
      } */
    }
  },

  VSITR: (settings: StandardSettings) => {
    return {
      description: `**STANDARD OF THE FEDERAL OFFICE FOR INFORMATION SECURITY (BSI-VSITR)**
        Pass 1: Overwriting the data with a zero;
        Pass 2: Overwriting the data with a one;
        Pass 3-6: Same as 1-2;
        Pass 7: Overwriting the data with a random character.`,
      unlink: function (path: string, cb: (err: NodeJS.ErrnoException) => void) {
        const remove = async () => {
          const fileData = await file.init(path, settings)
          for (let i = 0; i < 3; i++) {
            await file.zeros(fileData)
            await file.ones(fileData)
          }
          await file.randomByte(fileData)
          await file.end(fileData)
        }
        // @ts-ignore
        remove().then(_ => cb(null)).catch(cb)
      }/* ,
      wipe: async function (deviceData: disk.DeviceData) {
        for (let i = 0; i < 3; i++) {
          await disk.zeros(deviceData, settings)
          await disk.ones(deviceData, settings)
        }
        await disk.randomByte(deviceData, settings)
      } */
    }
  },

  schneier: (settings: StandardSettings) => {
    return {
      description: `**BRUCE SCHNEIER ALGORITHM**
        Pass 1: Overwriting the data with a zero;
        Pass 2: Overwriting the data with a one;
        Pass 3-7: Overwriting the data with a random character.`,
      unlink: function (path: string, cb: (err: NodeJS.ErrnoException) => void) {
        const remove = async () => {
          const fileData = await file.init(path, settings)
          await file.zeros(fileData)
          await file.ones(fileData)
          await file.randomByte(fileData, { passes: 5 })
          await file.end(fileData)
        }
        // @ts-ignore
        remove().then(_ => cb(null)).catch(cb)
      }/* ,
      wipe: async function (deviceData: disk.DeviceData) {
        await disk.zeros(deviceData, settings)
        await disk.ones(deviceData, settings)
        await disk.randomByte(deviceData, settings, { passes: 5 })
      } */
    }
  },

  pfitzner: (settings: StandardSettings) => {
    return {
      description: `**PFITZNER METHOD**
        Pass 1 to Pass 33: Overwriting the data with a random character.`,
      unlink: function (path: string, cb: (err: NodeJS.ErrnoException) => void) {
        const remove = async () => {
          const fileData = await file.init(path, settings)
          await file.randomByte(fileData, { passes: 33 })
          await file.end(fileData)
        }
        // @ts-ignore
        remove().then(_ => cb(null)).catch(cb)
      }/* ,
      wipe: async function (deviceData: disk.DeviceData) {
        await disk.randomByte(deviceData, settings, { passes: 33 })
      } */
    }
  },

  gutmann: (settings: StandardSettings) => {
    return {
      description: `**PETER GUTMANN ALGORITHM**
        Pass 1-4: Overwriting with random data;
        Pass 5: Overwriting with 0x55;
        Pass 6: Overwriting with 0xAA;
        Pass 7-9: Overwriting with 0x92 0x49 0x24, then cycling through the bytes;
        Pass 10-25: Overwriting with 0x00, incremented by 1 at each pass, until 0xFF;
        Pass 26-28: Same as 7-9;
        Pass 29-31: Overwriting with 0x6D 0xB6 0xDB, then cycling through the bytes;
        Pass 32-35: Overwriting with random data.`,
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
      }/* ,
      wipe: async function (deviceData: disk.DeviceData) {
        await disk.random(deviceData, settings, { passes: 4 })
        await disk.byte(deviceData, settings, { data: 0x55 })
        await disk.byte(deviceData, settings, { data: 0xAA })
        await disk.byteArray(deviceData, settings, { data: [0x92, 0x49, 0x24] })
        await disk.byteArray(deviceData, settings, { data: [0x49, 0x24, 0x92] })
        await disk.byteArray(deviceData, settings, { data: [0x24, 0x92, 0x49] })
        await disk.forByte(deviceData, settings, { initial: 0x00, condition: i => i < 0xFF, increment: i => i + 0x11 })
        await disk.byteArray(deviceData, settings, { data: [0x92, 0x49, 0x24] })
        await disk.byteArray(deviceData, settings, { data: [0x49, 0x24, 0x92] })
        await disk.byteArray(deviceData, settings, { data: [0x24, 0x92, 0x49] })
        await disk.byteArray(deviceData, settings, { data: [0x6D, 0xB6, 0xDB] })
        await disk.byteArray(deviceData, settings, { data: [0xB6, 0xDB, 0x6D] })
        await disk.byteArray(deviceData, settings, { data: [0xDB, 0x6D, 0xB6] })
        await disk.random(deviceData, settings, { passes: 4 })
      } */
    }
  }
}

export class CheckError extends Error {
  code: string
  constructor (message: string) {
    super(message)
    this.message = 'Invalid checksum: ' + message
    this.code = 'ECHECKSUM'
  }
}

/* export class WipeError extends Error {
  code: string
  constructor (message: string) {
    super(message)
    this.message = 'Unsupported wipe function: ' + message
    this.code = 'EWIPE'
  }
} */

const randomBytes = util.promisify(crypto.randomBytes)

export interface StandardSettings {
  eventEmitter: events.EventEmitter
  maxCheckTries?: number
}
