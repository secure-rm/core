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


