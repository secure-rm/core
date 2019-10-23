/**
 * rimraf.js under ISC License
 * Copyright (c) Isaac Z. Schlueter and Contributors
 * Secure-rm modified version
 */

import path from 'path'
import glob from 'glob'
import fs from 'fs'

const defaultGlobOpts = {
  nosort: true,
  silent: true
}

// for EMFILE handling
let timeout = 0

const isWindows = (process.platform === 'win32')

interface FunctionsOptions {
  unlink: typeof fs.unlink
  rmdir: typeof fs.rmdir
  unlinkSync: typeof fs.unlinkSync
  rmdirSync: typeof fs.rmdirSync
}

interface RawOptions extends FunctionsOptions {
  maxBusyTries?: number
  emfileWait?: number
  disableGlob?: boolean
  glob?: glob.IOptions | false
}

interface Options extends FunctionsOptions {
  maxBusyTries: number
  emfileWait: number
  disableGlob: boolean
  glob: glob.IOptions
}

function defaults (rawOptions: RawOptions): Options {
  return {
    unlink: rawOptions.unlink,
    rmdir: rawOptions.rmdir,
    unlinkSync: rawOptions.unlinkSync,
    rmdirSync: rawOptions.rmdirSync,
    maxBusyTries: rawOptions.maxBusyTries || 3,
    emfileWait: rawOptions.emfileWait || 1000,
    disableGlob: rawOptions.glob === false ? true : rawOptions.disableGlob || false,
    glob: rawOptions.glob || defaultGlobOpts
  }
}

export default function rimraf (p: string, rawOptions: RawOptions, callback: (error: NodeJS.ErrnoException | null) => void) {
  const options = defaults(rawOptions)

  let n = 0
  let busyTries = 0
  let errState: NodeJS.ErrnoException | null = null

  const next = (err: NodeJS.ErrnoException | null) => {
    errState = errState || err
    if (--n === 0) { callback(errState) }
  }

  const afterGlob = (err: NodeJS.ErrnoException | null, matches: string[]) => {
    if (err) { return callback(err) }

    n = matches.length
    if (n === 0) { return callback(null) }

    matches.forEach(p => {
      const CB = (err: NodeJS.ErrnoException | null) => {
        if (err) {
          if ((err.code === 'EBUSY' || err.code === 'ENOTEMPTY' || err.code === 'EPERM') &&
              busyTries < options.maxBusyTries) {
            busyTries++
            // try again, with the same exact callback as this one.
            return setTimeout(() => rimraf_(p, options, CB), busyTries * 100)
          }

          // this one won't happen if graceful-fs is used.
          if (err.code === 'EMFILE' && timeout < options.emfileWait) {
            return setTimeout(() => rimraf_(p, options, CB), timeout++)
          }

          // already gone
          if (err.code === 'ENOENT') err = null
        }

        timeout = 0
        next(err)
      }
      rimraf_(p, options, CB)
    })
  }

  if (options.disableGlob || !glob.hasMagic(p)) { return afterGlob(null, [p]) }

  fs.lstat(p, (err, stat_) => {
    if (!err) { return afterGlob(null, [p]) }

    glob(p, options.glob, afterGlob)
  })
}

// Two possible strategies.
// 1. Assume it's a file.  unlink it, then do the dir stuff on EPERM or EISDIR
// 2. Assume it's a directory.  readdir, then do the file stuff on ENOTDIR
//
// Both result in an extra syscall when you guess wrong.  However, there
// are likely far more normal files in the world than directories.  This
// is based on the assumption that a the average number of files per
// directory is >= 1.
//
// If anyone ever complains about this, then I guess the strategy could
// be made configurable somehow.  But until then, YAGNI.
function rimraf_ (p: string, options: Options, callback: (error: NodeJS.ErrnoException | null) => void) {
  // sunos lets the root user unlink directories, which is... weird.
  // so we have to lstat here and make sure it's not a dir.
  fs.lstat(p, (err, stats) => {
    if (err && err.code === 'ENOENT') { return callback(null) }

    // Windows can EPERM on stat.  Life is suffering.
    if (err && err.code === 'EPERM' && isWindows) { fixWinEPERM(p, options, err, callback) }

    if (stats && stats.isDirectory()) { return rmdir(p, options, err, callback) }

    options.unlink(p, err => {
      if (err) {
        if (err.code === 'ENOENT') { return callback(null) }
        if (err.code === 'EPERM') {
          return (isWindows)
            ? fixWinEPERM(p, options, err, callback)
            : rmdir(p, options, err, callback)
        }
        if (err.code === 'EISDIR') { return rmdir(p, options, err, callback) }
      }
      return callback(err)
    })
  })
}

function fixWinEPERM (p: string, options: Options, err: NodeJS.ErrnoException | null, callback: (error: NodeJS.ErrnoException | null) => void) {
  fs.chmod(p, 0o666, err2 => {
    if (err2) { callback(err2.code === 'ENOENT' ? null : err) } else {
      fs.stat(p, (err3, stats) => {
        if (err3) { callback(err3.code === 'ENOENT' ? null : err) } else if (stats.isDirectory()) { rmdir(p, options, err, callback) } else { options.unlink(p, callback) }
      })
    }
  })
}

function fixWinEPERMSync (p: string, options: Options, err: NodeJS.ErrnoException | null) {
  try {
    fs.chmodSync(p, 0o666)
  } catch (er2) {
    if (er2.code === 'ENOENT') { return } else { throw err }
  }

  let stats
  try {
    stats = fs.statSync(p)
  } catch (er3) {
    if (er3.code === 'ENOENT') { return } else { throw err }
  }

  if (stats.isDirectory()) { rmdirSync(p, options, err) } else { options.unlinkSync(p) }
}

function rmdir (p: string, options: Options, originalErr: NodeJS.ErrnoException | null, callback: (error: NodeJS.ErrnoException | null) => void) {
  // try to rmdir first, and only readdir on ENOTEMPTY or EEXIST (SunOS)
  // if we guessed wrong, and it's not a directory, then
  // raise the original error.
  options.rmdir(p, (err) => {
    if (err && (err.code === 'ENOTEMPTY' || err.code === 'EEXIST' || err.code === 'EPERM')) { rmkids(p, options, callback) } else if (err && err.code === 'ENOTDIR') { callback(originalErr) } else { callback(err) }
  })
}

function rmkids (p: string, options: Options, callback: (error: NodeJS.ErrnoException | null) => void) {
  fs.readdir(p, (err, files) => {
    if (err) { return callback(err) }
    let n = files.length
    if (n === 0) { return options.rmdir(p, callback) }
    let errState: any
    files.forEach(file => {
      rimraf(path.join(p, file), options, (err) => {
        if (errState) { return }
        if (err) { return callback(errState = err) }
        if (--n === 0) { options.rmdir(p, callback) }
      })
    })
  })
}

// this looks simpler, and is strictly *faster*, but will
// tie up the JavaScript thread and fail on excessively
// deep directory trees.
function rimrafSync (p: string, options: Options) {
  options = options || {}
  defaults(options)

  let results

  if (options.disableGlob || !glob.hasMagic(p)) {
    results = [p]
  } else {
    try {
      fs.lstatSync(p)
      results = [p]
    } catch (er) {
      results = glob.sync(p, options.glob)
    }
  }

  if (!results.length) { return }

  for (let i = 0; i < results.length; i++) {
    const p = results[i]

    let st
    try {
      st = fs.lstatSync(p)
    } catch (er) {
      if (er.code === 'ENOENT') { return }

      // Windows can EPERM on stat.  Life is suffering.
      if (er.code === 'EPERM' && isWindows) { fixWinEPERMSync(p, options, er) }
    }

    try {
      // sunos lets the root user unlink directories, which is... weird.
      if (st && st.isDirectory()) { rmdirSync(p, options, null) } else { options.unlinkSync(p) }
    } catch (er) {
      if (er.code === 'ENOENT') { return }
      if (er.code === 'EPERM') { return isWindows ? fixWinEPERMSync(p, options, er) : rmdirSync(p, options, er) }
      if (er.code !== 'EISDIR') { throw er }

      rmdirSync(p, options, er)
    }
  }
}

const rmdirSync = (p: string, options: Options, originalEr: NodeJS.ErrnoException | null) => {
  try {
    options.rmdirSync(p)
  } catch (er) {
    if (er.code === 'ENOENT') { return }
    if (er.code === 'ENOTDIR') { throw originalEr }
    if (er.code === 'ENOTEMPTY' || er.code === 'EEXIST' || er.code === 'EPERM') { rmkidsSync(p, options) }
  }
}

function rmkidsSync (p: string, options: Options) {
  fs.readdirSync(p).forEach(f => rimrafSync(path.join(p, f), options))

  // We only end up here once we got ENOTEMPTY at least once, and
  // at this point, we are guaranteed to have removed all the kids.
  // So, we know that it won't be ENOENT or ENOTDIR or anything else.
  // try really hard to delete stuff on windows, because it has a
  // PROFOUNDLY annoying habit of not closing handles promptly when
  // files are deleted, resulting in spurious ENOTEMPTY errors.
  /* const retries = isWindows ? 100 : 1
  let i = 0
  do {
    let threw = true
    try {
      const ret = options.rmdirSync(p, { recursive: false })
      threw = false
      return ret
    } finally {
      if (++i < retries && threw)
        continue
    }
  } while (true) */

  const retries = isWindows ? 100 : 1
  for (let i = 0; i < retries; i++) {
    try {
      const ret = options.rmdirSync(p, { recursive: false })
      return ret
    } finally {}
  }
}

export { rimrafSync as sync }
