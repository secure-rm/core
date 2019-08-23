import fs from 'fs'
import rimraf from 'rimraf'
import { methods, validIDs } from './methods'
export { write, eventEmitter } from './write'

interface Options {
  method?: string
  customMethod?: typeof fs.unlink
  maxBusyTries?: number
  disableGlob?: boolean
}

interface ParsedOptions {
  method: keyof typeof methods
  customMethod?: typeof fs.unlink
  maxBusyTries?: number
  disableGlob?: boolean
}

type Callback = (err: NodeJS.ErrnoException | null, path: string) => void

// Main function when secure-rm is called
export function secureRm(path: string): Promise<string>
export function secureRm(path: string, options: Options): Promise<string>
export function secureRm(path: string, callback: Callback): void
export function secureRm(path: string, options: Options, callback: Callback): void

export default function secureRm(path: string, options?: Options | Callback, callback?: Callback) {
  // Parse if callback is provided
  if (callback === undefined && typeof options === 'function') {
    callback = options
    options = { method: 'secure' }
  }
  // Define method if none is provided
  if (typeof (options as Options).method !== 'string') (options as Options).method = 'secure'

  if (callback) secureRmCallback(path, options as ParsedOptions, (err: NodeJS.ErrnoException | null, path: string) => callback!(err, path))
  else return secureRmPromise(path, options as ParsedOptions)
}

// Callback version
function secureRmCallback(path: string, options: ParsedOptions, callback: Callback): void {
  if (options.customMethod) {
    rimraf(path as string, {
      unlink: options.customMethod,
      maxBusyTries: options.maxBusyTries || 3,
      disableGlob: options.disableGlob || false
    }, (err: NodeJS.ErrnoException) => callback(err, path))
  } else if (validIDs.includes(options.method)) {
    rimraf(path as string, {
      unlink: methods[options.method].method,
      maxBusyTries: options.maxBusyTries || 3,
      disableGlob: options.disableGlob || false
    }, (err: NodeJS.ErrnoException) => callback(err, path))
  } else {
    callback(new Error(`'${options.method}' is not a valid ID. \nList of valid IDs: ${validIDs}`), path)
  }
}

// Promise version
function secureRmPromise(path: string, options: ParsedOptions): Promise<string> {
  return new Promise((resolve, reject) => {
    if (options.customMethod) {
      rimraf(path as string, {
        unlink: options.customMethod,
        maxBusyTries: options.maxBusyTries || 3,
        disableGlob: options.disableGlob || false
      }, (err: NodeJS.ErrnoException) => {
        if (err) reject(err)
        else resolve(path)
      })
    } else if (validIDs.includes(options.method)) {
      rimraf(path as string, {
        unlink: methods[options.method].method,
        maxBusyTries: options.maxBusyTries || 3,
        disableGlob: options.disableGlob || false
      }, (err: NodeJS.ErrnoException) => {
        if (err) reject(err)
        else resolve(path)
      })
    } else {
      reject(new Error(`'${options.method}' is not a valid ID. \nList of valid IDs: ${validIDs}`))
    }
  })
}
