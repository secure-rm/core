import fs from 'fs'
import path from 'path'
import util from 'util'
import crypto from 'crypto'
import { eventEmitter, eventError } from './events'

type StepFunction = (p: string) => Promise<string>

interface FakeLogError {
  (message?: string | undefined): Error
  code: string
}

const directoryStack: string[] = []

export default class RmDir {
  private steps: Array<StepFunction>
  compile: typeof fs.rmdir

  constructor () {
    this.steps = []
    this.compile = Object.assign(
      (p: fs.PathLike, options: fs.RmDirAsyncOptions | fs.NoParamCallback | undefined, callback?: fs.NoParamCallback) => {
        if (callback === undefined && typeof options === 'function') {
          callback = options
          options = undefined
        }
        this.steps.push(() => {
          return new Promise((resolve) => {
            callback!(null)
            resolve(p as string)
          })
        })
        this.steps.reduce((prev: Promise<string>, next: StepFunction) => {
          return prev.then((p) => next(p))
            .catch((err: NodeJS.ErrnoException) => {
              eventError(err, p as string)
              callback!(err)
              return Promise.reject(err)
            })
        }, this.init(p as string))
          .catch((err: NodeJS.ErrnoException) => {
            eventError(err, p as string)
            callback!(err)
          })
      },
      { __promisify__: util.promisify(fs.rmdir) } // FIXME
    )
  }

  private init (p: string): Promise<string> {
    return new Promise((resolve) => {
      eventEmitter.emit('start', p)
      resolve(p)
    })
  }

  log () {
    this.steps.push(
      function (p: string) {
        return new Promise((resolve, reject) => {
          if (directoryStack.includes(p)) {
            resolve(p)
          } else {
            const split = p.split(path.sep)
            console.log('┃ '.repeat(split.length - 1) + '┠─' + split[split.length - 1])
            directoryStack.push(p)
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
          const newName = crypto.randomBytes(9).toString('base64').replace(/\//g, '0').replace(/\+/g, 'a')
          const newPath = path.join(path.dirname(p), newName)
          eventEmitter.emit('verbose', p, `Renaming to ${newName} `)
          fs.rename(p, newPath, (err) => {
            if (err) reject(err)
            else resolve(newPath)
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
          eventEmitter.emit('remove', p)
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
