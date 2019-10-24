import events from 'events'

export const eventEmitter = new events.EventEmitter()

// Emit event with better message error
export function eventError (err: NodeJS.ErrnoException, file: string): void {
  if (err) {
    switch (err.code) {
      case 'EMFILE':
        eventEmitter.emit('warn', file, `Too many open files, cannot ${err.syscall || 'access'}: `)
        break
      case 'ENOENT':
        eventEmitter.emit('warn', file, 'This file no longer exists: ')
        break
      case 'EPERM':
        eventEmitter.emit('error', file, `Operation not permitted on this file (${err.syscall}): `)
        break
      case 'ENOTEMPTY':
        // Work as intended
        break
      default:
        if (err.message === '64bit files are not yet supported.') {
          eventEmitter.emit('error', file, '64bit files are not yet supported.')
        } else {
          console.log(err)
          throw err
        }
      // break
    }
  }
}

/* eventEmitter.on('start', (file) => console.log('Starting ' + file))
eventEmitter.on('unlink', (file) => console.log('Unlinking ' + file))
eventEmitter.on('done', (file) => console.log('Done ' + file))

eventEmitter.on('verbose', (file, info) => console.log(info + file))

eventEmitter.on('warn', (file, err) => console.log(err + file))
eventEmitter.on('error', (file, err) => console.log(err + file)) */
