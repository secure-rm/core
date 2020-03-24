import fs from 'fs-extra'
import fs_ from 'fs'
import { kMaxLength } from 'buffer'
import glob from 'glob'

interface Options {
  standard?: {
    unlink?: typeof fs.unlink
    rmdir?: typeof fs.rmdir
  },
  maxBusyTries?: number,
  emfileWait?: number,
  /** @default false */
  disableGlob?: boolean,
  glob?: glob.IOptions | false
}

type Callback = (err: NodeJS.ErrnoException | null) => void
type ThenArg<T> = T extends PromiseLike<infer U> ? U : T
type RemovePromise = ReturnType<typeof remove_>
type RemoveCallback = ThenArg<ReturnType<typeof remove_>>

const defaultGlobOpts = {
  dot: true,
  nosort: true,
  silent: true
}

async function remove_ (path: string, options?: Options) {
  await fs.remove(path, {
    ...options,
    ...options?.standard,
    glob: options?.glob || defaultGlobOpts
  })
}

export function remove (path: string, options?: Options): RemovePromise
export function remove (path: string, callback: Callback): RemoveCallback
export function remove (path: string, options: Options, callback: Callback): RemoveCallback

export function remove (...args: any[]): RemovePromise | RemoveCallback {
  const callback = args[args.length - 1]
  if (typeof callback !== 'function') return remove_.apply(null, args)
  else remove_.apply(null, args.slice(0, -1)).then(result => callback(null, result), callback)
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
  return await writeExtended(fd, data, size, 0)
}

async function writeExtended (fd: number, data: number, size: number, pos: number): Promise<void> {
  if (size - pos <= kMaxLength) {
    await fs.write(fd, Buffer.alloc(size, data), pos)
    return await fs.close(fd)
  }
  await fs.write(fd, Buffer.alloc(kMaxLength, data), pos)
  return await writeExtended(fd, data, size, pos + kMaxLength)
}
