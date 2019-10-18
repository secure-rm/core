import fs from 'fs'
import rimraf from 'rimraf'
import { standards, validIDs } from './standards'

export interface Options {
  standard?: string
  customStandard?: typeof fs.unlink
  maxBusyTries?: number
  disableGlob?: boolean
}

export interface ParsedOptions {
  standard: keyof typeof standards
  customStandard?: typeof fs.unlink
  maxBusyTries?: number
  disableGlob?: boolean
}

export type Callback = (err: NodeJS.ErrnoException | null, path: string) => void

// Main function when secure-rm is called
export function unlink(path: string): Promise<string>
export function unlink(path: string, options: Options): Promise<string>
export function unlink(path: string, callback: Callback): void
export function unlink(path: string, options: Options, callback: Callback): void

export function unlink (path: string, options?: Options | Callback, callback?: Callback) {
  // Parse if callback is provided
  if (callback === undefined && typeof options === 'function') {
    callback = options
    options = { standard: 'secure' }
  }
  // Define standard if none is provided
  if (options === undefined) options = { standard: 'secure' }
  if ((options as Options).standard === undefined) (options as Options).standard = 'secure'

  if (callback) unlinkCallback(path, options as ParsedOptions, (err: NodeJS.ErrnoException | null, path: string) => callback!(err, path))
  else return unlinkPromise(path, options as ParsedOptions)
}

// (module).exports = secureRm

// Callback version
function unlinkCallback (path: string, options: ParsedOptions, callback: Callback): void {
  if (options.customStandard) {
    rimraf(path, {
      unlink: options.customStandard,
      maxBusyTries: options.maxBusyTries || 3,
      disableGlob: options.disableGlob || false
    }, (err: NodeJS.ErrnoException) => callback(err, path))
  } else if (validIDs.includes(options.standard)) {
    rimraf(path, {
      unlink: standards[options.standard].method,
      maxBusyTries: options.maxBusyTries || 3,
      disableGlob: options.disableGlob || false
    }, (err: NodeJS.ErrnoException) => callback(err, path))
  } else {
    callback(new Error(`'${options.standard}' is not a valid ID. \nList of valid IDs: ${validIDs}`), path)
  }
}

// Promise version
function unlinkPromise (path: string, options: ParsedOptions): Promise<string> {
  return new Promise((resolve, reject) => {
    if (options.customStandard) {
      rimraf(path, {
        unlink: options.customStandard,
        maxBusyTries: options.maxBusyTries || 3,
        disableGlob: options.disableGlob || false
      }, (err: NodeJS.ErrnoException) => {
        if (err) reject(err)
        else resolve(path)
      })
    } else if (validIDs.includes(options.standard)) {
      rimraf(path, {
        unlink: standards[options.standard].method,
        maxBusyTries: options.maxBusyTries || 3,
        disableGlob: options.disableGlob || false
      }, (err: NodeJS.ErrnoException) => {
        if (err) reject(err)
        else resolve(path)
      })
    } else {
      reject(new Error(`'${options.standard}' is not a valid ID. \nList of valid IDs: ${validIDs}`))
    }
  })
}
