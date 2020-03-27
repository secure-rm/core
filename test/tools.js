const fs = require('fs-extra')
const path = require('path')
const mkdirp = require('mkdirp')
const crypto = require('crypto')

module.exports = init

let target

function init (__dirname, __filename) {
  target = path.resolve(__dirname, `./target-${path.basename(__filename).replace(/(.*)(\.test\.js)/, '$1')}`)
  try {
    fs.mkdirSync(target)
  } catch (err) {}
  return { fill, cleanup, createPath }
}

function fill (depth, files, folders, target) {
  mkdirp.sync(target)
  const o = { flag: 'wx' }

  for (let f = files; f > 0; f--) {
    fs.writeFileSync(target + '/f-' + depth + '-' + f, '', o)
  }

  // valid symlink
  // fs.symlinkSync('f-' + depth + '-1', target + '/link-' + depth + '-good', 'file')

  // invalid symlink
  // fs.symlinkSync('does-not-exist', target + '/link-' + depth + '-bad', 'file')

  // file with a name that looks like a glob
  fs.writeFileSync(target + '/[a-z0-9].txt', '', o)
  // file with a dot
  fs.writeFileSync(target + '/.hidden', '', o)

  depth--
  if (depth <= 0) { return }

  for (let f = folders; f > 0; f--) {
    mkdirp.sync(target + '/folder-' + depth + '-' + f)
    fill(depth, files, folders, target + '/d-' + depth + '-' + f)
  }
}

function createPath () {
  return path.resolve(target, crypto.randomBytes(18).toString('base64').replace(/\//g, '0').replace(/\+/g, 'a'))
}

async function cleanup () {
  await fs.remove(target)
}
