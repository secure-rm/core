import fs from 'fs-extra'
import events from 'events'
import { standards, StandardSettings } from './standards'// eslint-disable-line
import * as disk from './disk'// eslint-disable-line

export function wipeDisk (device: string, deviceSize: number, options?: Options): ReturnPromise
export function wipeDisk (device: string, deviceSize: number, callback: Callback): ReturnCallback
export function wipeDisk (device: string, deviceSize: number, options: Options, callback: Callback): ReturnCallback

export function wipeDisk (device: string, deviceSize: number, options?: Options | Callback, callback?: Callback): ReturnPromise | ReturnCallback {
  const eventEmitter = new events.EventEmitter()
  if (callback === undefined && typeof options === 'function') {
    callback = options
    // @ts-ignore
    options = { standard: standards.secure }
  }
  // @ts-ignore
  options = options || {}
  // @ts-ignore
  options.standard = options.standard || standards.secure
  if (callback) {
    wipeDisk_(device, deviceSize, options as ParsedOptions, eventEmitter)
      .then(result => callback!(null, result))
      .catch(err => callback!(err, null))
    return eventEmitter
  }
  return { events: eventEmitter, result: wipeDisk_(device, deviceSize, options as ParsedOptions, eventEmitter) }
}

async function wipeDisk_ (device: string, deviceSize: number, options: ParsedOptions, eventEmitter: events.EventEmitter) {
  await options.standard({ eventEmitter })
    .wipe({
      device,
      deviceSize,
      chunkSize: options.chunkSize
    })
  eventEmitter.emit('done', device)
}

interface Options {
  standard?: (settings: StandardSettings) => {
    unlink?: typeof fs.unlink
    rmdir?: typeof fs.rmdir
    wipe?: (deviceData: disk.DeviceData) => Promise<void>
  }
  chunkSize?: number
}

interface ParsedOptions {
  standard: (settings: StandardSettings) => {
    unlink: typeof fs.unlink
    rmdir?: typeof fs.rmdir
    wipe: (deviceData: disk.DeviceData) => Promise<void>
  }
  chunkSize?: number
}

type ThenArg<T> = T extends PromiseLike<infer U> ? U : T
type RemoveReturn = ReturnType<typeof wipeDisk_>
type Callback = (err: NodeJS.ErrnoException | null, res: any) => ThenArg<RemoveReturn>
type ReturnCallback = events.EventEmitter
type ReturnPromise = {
  events: events.EventEmitter
  result: RemoveReturn
}
