import fs from 'fs'
import path from 'path'
import util from 'util'
import crypto from 'crypto'
import { eventEmitter, eventError, tree } from './events'

type StepFunction = (p: string, uuid: string) => Promise<string>

export default class RmDir {
  private steps: Array<StepFunction>
  compile: (uuid: string) => typeof fs.rmdir

  constructor () {
    this.steps = []
    this.compile = (uuid) => {
      tree[uuid] = []
      return Object.assign(
        (p: fs.PathLike, options: fs.RmDirAsyncOptions | fs.NoParamCallback | undefined, callback?: fs.NoParamCallback) => {
          if (callback === undefined && typeof options === 'function') {
            callback = options
            options = undefined
          }
          this.steps.reduce((prev: Promise<string>, next: StepFunction) => {
            return prev.then((p) => next(p, uuid))
              .catch((err: NodeJS.ErrnoException) => {
                if (err.message !== 'handledPromise') {
                  eventError(err, p as string)
                callback!(err)
                }
                return Promise.reject(new Error('handledPromise'))
              })
          }, this.init(p as string))
            .then(() => callback!(null))
            .catch((err: NodeJS.ErrnoException) => {
              if (err.message !== 'handledPromise') {
                eventError(err, p as string)
                callback!(err)
              }
            })
        },
        { __promisify__: util.promisify(fs.rmdir) } // FIXME
      )
    }
  }

  private init (p: string): Promise<string> {
    return new Promise((resolve) => {
      eventEmitter.emit('start', p)
      resolve(p)
    })
  }

  then (fun: StepFunction) {
    this.steps.push(fun)
    return this
  }

  log () {
    this.steps.push(
      function (p: string, uuid: string) {
        return new Promise((resolve, reject) => {
          if (tree[uuid].includes(p)) {
            resolve(p)
          } else {
            tree[uuid].push(p)
            /* const split = p.split(path.sep)
            console.log('┃ '.repeat(split.length - 1) + '┠─' + split[split.length - 1]) */
            const err: NodeJS.ErrnoException = new Error('Log error (or is it?)')
            err.code = 'ENOTEMPTY'
            reject(err)
          }
        })
      })
    return this
  }

  // Rename to random string
  rename () {
    this.steps.push(
      function (p: string) {
        return new Promise((resolve, reject) => {
          fs.readdir(p, (err, files) => {
            if (err) reject(err)
            if (!files.length) {
              // directory appears to be empty
              const newName = crypto.randomBytes(9).toString('base64').replace(/\//g, '0').replace(/\+/g, 'a')
              const newPath = path.join(path.dirname(p), newName)
              eventEmitter.emit('verbose', p, `Renaming to ${newName} `)
              fs.rename(p, newPath, (err) => {
                if (err) reject(err)
                else resolve(newPath)
              })
            } else {
              fs.rmdir(p, (err) => {
                reject(err)
              })
            }
          })
        })
      })
    return this
  }

  // End function: remove the directory
  rmdir () {
    this.steps.push(
      function (p: string) {
        return new Promise((resolve, reject) => {
          eventEmitter.emit('verbose', p, 'Removing')
          fs.rmdir(p, (err) => {
            if (err) reject(err)
            else {
              eventEmitter.emit('done', p)
              resolve(p)
            }
          })
        })
      })
    return this.compile
  }

  /*
  template(passes: number = 1) {
    this.steps = this.steps.concat(
      Array(passes).fill(
        function (file: string, fileSize: number) {
          return
        }))
    return this
  }
  */

  /*
  template() {
    this.steps.push(
      function (file: string, fileSize: number) {
        return
      })
    return this
  }
  */
}
