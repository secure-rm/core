import fs from 'fs-extra'
import path from 'path'
import crypto from 'crypto'
import { eventEmitter } from './events'

const folderSet = new Set()

/**
 * Remove the folder. This function is mandatory.
 * @param fileData Generated by function init.
 */
export async function end (folderName: string) {
  await fs.rmdir(folderName)
  eventEmitter.emit('removed', folderName)
}

/**
  * Rename the directory to a random string of length 12.
  * @param folderName The folder that will be processed.
  */
export async function rename (folderName: string) {
  const files = await fs.readdir(folderName)
  if (files.length) {
    // will throw error
    await fs.rmdir(folderName)
    throw new Error('If this message appears, something went wrong')
  } else {
    const newName = crypto.randomBytes(9).toString('base64').replace(/\//g, '0').replace(/\+/g, 'a')
    const newPath = path.join(path.dirname(folderName), newName)
    await fs.rename(folderName, newPath)
    return newPath
  }
}

/**
 * Mark the folder, does nothing.
 * @param folderName The folder that will be processed.
 */
export async function markFolder (folderName: string) {
  if (folderSet.has(folderName)) {
    folderSet.delete(folderName)
    eventEmitter.emit('mark', folderName)
  } else {
    folderSet.add(folderName)
    await fs.rmdir(folderName)
  }
}