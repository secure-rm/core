import fs from 'fs'
import path from 'path'
import util from 'util'
import crypto from 'crypto'
import { eventEmitter, eventError, tree } from './events'

type StepFunction = (p: string, uuid: string) => Promise<string>

/**
 * The RmDir class helps you create your own custom unlink method.
 * Unless you know what you're doing, always end with `.rmDir()`.
 * Invoke it and chain the methods:
 * @example
 * new srm.RmDir()
    .random()
    .rmDir()
 * @class
 */
export default class RmDir {
  private steps: Array<StepFunction>

  /**
    * Use this if you want to compile the standard without unlink.
    * Useful for preview and testing uses.
    * Used in `rmdir()`.
    * @param {string} uuid - Unique identifier used internally.
    * @return {fs.rmdir} The compiled rmDir standard.
    */
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

  /**
  * Your custom function to apply on the directory.
  * @param {StepFunction} fun - The number of times the function is executed.
  * @return {RmDir} The rmDir Class.
  * @example
  * new srm.Unlink()
    .then(function (p) {
      return new Promise((resolve, reject) => {
        if (p === '/d/code/')
          reject(new Error())
        else
          resolve(p)
      })
    })
    .unlink()
  */
  then (fun: StepFunction) {
    this.steps.push(fun)
    return this
  }

  /**
  * Help to construct the tree of erased directories.
  * Used in the preview standard.
  * @return {RmDir} The rmDir Class.
  */
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

  /**
  * Rename the directory to a random string of length 12.
  * @return {RmDir} The rmDir Class.
  */
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

  /**
  * The last function to be executed: remove the directory.
  * Required, invalid standard if omitted.
  * @return {fs.rmdir} The compiled rmDir standard.
  */
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
