import fs from 'fs-extra'
import { standards } from './standards'

interface Options {
  standard?: {
    unlink?: typeof fs.unlink
    rmdir?: typeof fs.rmdir
  }
  maxBusyTries: number
}

type Callback = (err: NodeJS.ErrnoException | null, res: any) => void
type ThenArg<T> = T extends PromiseLike<infer U> ? U : T
type ReturnPromise = ReturnType<typeof remove_>
type ReturnCallback = ThenArg<ReturnType<typeof remove_>>

export function remove (path: string, options?: Options): ReturnPromise
export function remove (path: string, callback: Callback): ReturnCallback
export function remove (path: string, options: Options, callback: Callback): ReturnCallback

export function remove (path: string, options?: Options | Callback, callback?: Callback): ReturnPromise | ReturnCallback {
  if (callback === undefined && typeof options === 'function') {
    callback = options
    // @ts-ignore
    options = { standard: standards.secure }
  }
  if (options === undefined) {
    // @ts-ignore
    options = { standard: standards.secure }
  }
  if (callback) {
    remove_(path, options as Options)
      .then(result => callback!(null, result))
      .catch(err => callback!(err, null))
  } else {
    return remove_(path, options as Options)
  }
}

async function remove_ (path: string, options?: Options) {
  // @ts-ignore
  await fs.remove(path, {
    ...options,
    ...options?.standard
  })
}
