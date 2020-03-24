import { kMaxLength } from 'buffer'
import fs from 'fs-extra'

export const standards = {
  myFs: {
    unlink: async function (file: string, cb: (err: NodeJS.ErrnoException) => void) {
      console.log(file)
      const stats = await fs.stat(file)
      await initWriteExtended(file, 0b00000000, stats.size)
      fs.unlink(file, cb)
    }
  }
}

async function initWriteExtended (file: string, data: number, size: number) {
  const fd = await fs.open(file, 'w')
  return writeExtended(fd, data, size, 0)
}

async function writeExtended (fd: number, data: number, size: number, pos: number): Promise<void> {
  if (size - pos <= kMaxLength) {
    await fs.write(fd, Buffer.alloc(size, data), pos)
    return fs.close(fd)
  }
  await fs.write(fd, Buffer.alloc(kMaxLength, data), pos)
  return writeExtended(fd, data, size, pos + kMaxLength)
}
