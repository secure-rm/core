import events from 'events'

export const eventEmitter = new events.EventEmitter()

// Emit event with better message error
export function eventError (err: NodeJS.ErrnoException, file: string): void {
  if (err) {
    switch (err.code) {
      case 'EMFILE':
        eventEmitter.emit('notice', file, `Too many open files, cannot ${err.syscall || 'access'}: `)
        break
      case 'ENOENT':
        eventEmitter.emit('notice', file, 'This file no longer exists: ')
        break
      case 'EPERM':
        eventEmitter.emit('warn', file, `Operation not permitted on this file (${err.syscall}): `)
        break
      case 'ENOTEMPTY':
        // Work as intended
        break
      default:
        if (err.message === '64bit files are not yet supported.') {
          eventEmitter.emit('warn', file, '64bit files are not yet supported.')
        } else {
          eventEmitter.emit('error', file, err)
          // throw err
        }
      // break
    }
  }
}

export const tree: { [key: string]: string[] } = {}

const debug = process.argv.includes('--debug')

if (debug) {
  eventEmitter.on('debug', (file, message) => console.log('\x1b[38;2;128;0;128m Debug \x1b[39m' + message + file))
  eventEmitter.on('info', (file, message) => console.log('\x1b[38;2;0;0;255m Info \x1b[39m' + message + file))
  eventEmitter.on('notice', (file, message) => console.log('\x1b[38;2;0;255;255m Notice \x1b[39m' + message + file))
  eventEmitter.on('warn', (file, message) => console.log('\x1b[38;2;255;255;0m Warn \x1b[39m' + message + file))
  eventEmitter.on('error', (file, message) => console.log('\x1b[38;2;255;0;0m Error \x1b[39m' + message + file))
}
