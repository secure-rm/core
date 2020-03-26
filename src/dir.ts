import fs from 'fs-extra'
import path from 'path'
import crypto from 'crypto'

export async function rename (folderName: string, { passes = 1 }: Options = {}) {
  const files = await fs.readdir(folderName)
  if (files.length) {
    // will throw error
    await fs.rmdir(folderName)
    return ''
  } else {
    for (let i = 0; i < passes; i++) {
      const newName = crypto.randomBytes(9).toString('base64').replace(/\//g, '0').replace(/\+/g, 'a')
      const newPath = path.join(path.dirname(folderName), newName)
      await fs.rename(folderName, newPath)
      folderName = newPath
    }
    return folderName
  }
}

interface Options {
  passes?: number
}