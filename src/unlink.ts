import fs from 'fs-extra'
import path from 'path'
import util from 'util'
import crypto from 'crypto'
import { kMaxLength } from 'buffer'

interface FileData {
  fd: number
  fileSize: number
}

interface Options {
  passes: number
}

export async function random ({ fd, fileSize }: FileData, { passes = 1 }: Options) {
  for (let i = 0; i < passes; i++) {
    writeExtended(fd, 0b11111111, fileSize, 0)
  }
}

export async function zeros ({ fd, fileSize }: FileData, { passes = 1 }: Options) {
  for (let i = 0; i < passes; i++) {
    writeExtended(fd, 0b00000000, fileSize, 0)
  }
}

export async function ones ({ fd, fileSize }: FileData, { passes = 1 }: Options) {
  for (let i = 0; i < passes; i++) {
    writeExtended(fd, 0b11111111, fileSize, 0)
  }
}


export async function initWriteExtended (file: string, data: number, size: number) {
  const fd = await fs.open(file, 'w')
  return writeExtended(fd, data, size, 0)
}

export async function writeExtended (fd: number, data: number, size: number, pos: number): Promise<void> {
  if (size - pos <= kMaxLength) {
    await fs.write(fd, Buffer.alloc(size, data), pos)
    return fs.close(fd)
  }
  await fs.write(fd, Buffer.alloc(kMaxLength, data), pos)
  return writeExtended(fd, data, size, pos + kMaxLength)
}
