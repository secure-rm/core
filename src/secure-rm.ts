import crypto from 'crypto'
import rimraf from 'rimraf'
import glob from 'glob'// eslint-disable-line no-unused-vars
import { standards, validIDs, Standard } from './standards' // eslint-disable-line no-unused-vars
import { tree } from './events'

// to get the correct tree for each call
function getUUID () {
  return crypto.randomBytes(60).toString('base64').replace(/\//g, '0').replace(/\+/g, 'a')
}

interface Opts {
  customStandard?: Standard
  maxBusyTries?: number
  emfileWait?: number
  disableGlob?: boolean
  glob?: glob.IOptions | false
}

export interface Options extends Opts {
  standard?: string
}

export interface ParsedOptions extends Opts {
  standard: keyof typeof standards
}

export type Callback = (err: NodeJS.ErrnoException | null, tree: string[]) => void

// Main function when secure-rm is called
export function remove(path: string, options?: Options): Promise<string[]>
export function remove(path: string, callback: Callback): void
export function remove(path: string, options: Options, callback: Callback): void

export function remove (path: string, options?: Options | Callback, callback?: Callback) {
  const uuid = getUUID()
  // Parse if callback is provided
  if (callback === undefined && typeof options === 'function') {
    callback = options
    options = { standard: 'secure' }
  }
  // Define standard if none is provided
  if (options === undefined) options = { standard: 'secure' }
  if ((options as Options).standard === undefined) (options as Options).standard = 'secure'

  if (callback) removeCallback(path, options as ParsedOptions, uuid, (err: NodeJS.ErrnoException | null, goodTree: string[]) => callback!(err, goodTree))
  else return removePromise(path, options as ParsedOptions, uuid)
}

// (module).exports = secureRm

const defaultGlobOpts = {
  nosort: true,
  silent: true
}

// Callback version
function removeCallback (path: string, options: ParsedOptions, uuid: string, callback: Callback): void {
  if (options.customStandard) {
    rimraf(path, {
      unlink: options.customStandard.unlinkStandard(uuid),
      rmdir: options.customStandard.rmdirStandard(uuid),
      maxBusyTries: options.maxBusyTries || 3,
      emfileWait: options.emfileWait || 1000,
      disableGlob: options.glob === false ? true : options.disableGlob || false,
      glob: options.glob || defaultGlobOpts
    }, (err: NodeJS.ErrnoException) => callback(err, tree[uuid]))
  } else if (validIDs.includes(options.standard)) {
    rimraf(path, {
      unlink: standards[options.standard].unlinkStandard(uuid),
      rmdir: standards[options.standard].rmdirStandard(uuid),
      maxBusyTries: options.maxBusyTries || 3,
      emfileWait: options.emfileWait || 1000,
      disableGlob: options.glob === false ? true : options.disableGlob || false,
      glob: options.glob || defaultGlobOpts
    }, (err: NodeJS.ErrnoException) => callback(err, tree[uuid]))
  } else {
    callback(new Error(`'${options.standard}' is not a valid ID. \nList of valid IDs: ${validIDs}`), ['none'])
  }
}

// Promise version
function removePromise (path: string, options: ParsedOptions, uuid: string): Promise<string[]> {
  return new Promise((resolve, reject) => {
    if (options.customStandard) {
      rimraf(path, {
        unlink: options.customStandard.unlinkStandard(uuid),
        rmdir: options.customStandard.rmdirStandard(uuid),
        maxBusyTries: options.maxBusyTries || 3,
        emfileWait: options.emfileWait || 1000,
        disableGlob: options.glob === false ? true : options.disableGlob || false,
        glob: options.glob || defaultGlobOpts
      }, (err: NodeJS.ErrnoException) => {
        if (err) reject(err)
        else resolve(tree[uuid])
      })
    } else if (validIDs.includes(options.standard)) {
      rimraf(path, {
        unlink: standards[options.standard].unlinkStandard(uuid),
        rmdir: standards[options.standard].rmdirStandard(uuid),
        maxBusyTries: options.maxBusyTries || 3,
        emfileWait: options.emfileWait || 1000,
        disableGlob: options.glob === false ? true : options.disableGlob || false,
        glob: options.glob || defaultGlobOpts
      }, (err: NodeJS.ErrnoException) => {
        if (err) reject(err)
        else resolve(tree[uuid])
      })
    } else {
      reject(new Error(`'${options.standard}' is not a valid ID. \nList of valid IDs: ${validIDs}`))
    }
  })
}
