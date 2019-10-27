const fs = require('fs')
const path = require('path')
const mkdirp = require('mkdirp')
const rimraf = require('rimraf')
const uuidv4 = require('uuid/v4')

module.exports = init

let target

function init (__dirname, __filename) {
  target = path.resolve(__dirname, `./target-${path.basename(__filename).replace(/(.*)(\.test\.js)/, '$1')}`)
  return {
    tools: { fill, cleanup, createPath },
    target
  }
}

function fill (depth, files, folders, target) {
  mkdirp.sync(target)
  let o = { flag: 'wx' }
  if (process.version.match(/^v0\.8/)) { o = 'utf8' }

  for (let f = files; f > 0; f--) {
    fs.writeFileSync(target + '/f-' + depth + '-' + f, '', o)
  }

  // valid symlink
  // fs.symlinkSync('f-' + depth + '-1', target + '/link-' + depth + '-good', 'file')

  // invalid symlink
  // fs.symlinkSync('does-not-exist', target + '/link-' + depth + '-bad', 'file')
  // Issues on Windows!!

  // file with a name that looks like a glob
  fs.writeFileSync(target + '/[a-z0-9].txt', '', o)

  depth--
  if (depth <= 0) { return }

  for (let f = folders; f > 0; f--) {
    mkdirp.sync(target + '/folder-' + depth + '-' + f)
    fill(depth, files, folders, target + '/d-' + depth + '-' + f)
  }
}

function createPath () {
  return path.resolve(target, uuidv4())
}

function cleanup (done) {
  rimraf(target, (err) => {
    if (err) throw err
    done()
  })
}
