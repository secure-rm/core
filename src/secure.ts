import fs from 'fs-extra'
import { kMaxLength } from 'buffer'
import glob from 'glob'

interface Options {
  standard?: {
    unlink?: typeof fs.unlink
    rmdir?: typeof fs.rmdir
  },
  maxBusyTries?: number,
  emfileWait?: number,
  disableGlob?: boolean,
  glob?: glob.IOptions | false
}

type Callback = (err: NodeJS.ErrnoException | null, res: any) => void
type ThenArg<T> = T extends PromiseLike<infer U> ? U : T
type ReturnPromise = ReturnType<typeof remove_>
type ReturnCallback = ThenArg<ReturnType<typeof remove_>>

const defaultGlobOpts = {
  dot: true,
  nosort: true,
  silent: true
}

export function remove (path: string, options?: Options): ReturnPromise
export function remove (path: string, callback: Callback): ReturnCallback
export function remove (path: string, options: Options, callback: Callback): ReturnCallback

export function remove (path: string, options?: Options | Callback, callback?: Callback): ReturnPromise | ReturnCallback {
  if (callback === undefined && typeof options === 'function') {
    callback = options
    options = undefined
  }
  if (callback) {
    remove_(path, options as Options)
      .then(result => callback!(null, result))
      .catch(err => callback!(err, null))
  } else return remove_(path, options as Options)
}

async function remove_ (path: string, options?: Options) {
  await fs.remove(path, {
    ...options,
    ...options?.standard,
    glob: options?.glob || defaultGlobOpts
  })
}

var myFs = {
  unlink: async function (file: string, cb: (err: NodeJS.ErrnoException) => void) {
    console.log(file)
    const stats = await fs.stat(file)
    await initWriteExtended(file, 0b00000000, stats.size)
    fs.unlink(file, cb)
  }
}

async function initWriteExtended (file: string, data: number, size: number) {
  const fd = await fs.open(file, 'w')
  return writeExtended(fd, data, size, 0)
}

async function writeExtended (fd: number, data: number, size: number, pos: number): Promise<void> {
  if (size - pos <= kMaxLength) {
    await fs.write(fd, Buffer.alloc(size, data), pos)
    return fs.close(fd)
  }
  await fs.write(fd, Buffer.alloc(kMaxLength, data), pos)
  return writeExtended(fd, data, size, pos + kMaxLength)
}
