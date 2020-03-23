import fs from 'fs-extra'
import { kMaxLength } from 'buffer'

interface Options {
  standard?: {
    unlink?: typeof fs.unlink
    rmdir?: typeof fs.rmdir
  },
  maxBusyTries?: number,
  emfileWait?: number,
  disableGlob?: boolean
}

async function remove (path: string, options: Options) {
  await fs.remove(path, {
    ...options?.standard,
    glob: {
      dot: true,
      nosort: true,
      silent: true
    }
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
