const log = require('ololog').configure({ time: true, locate: false, tag: true }).handleNodeErrors()

log('foo', 'bar', 'baz')
log.red('red text')
log.bright.red.underline('multiple ')
log.blue('red text')

log('    ', 'foo\nbar\nbar')

log({ foo: true, bar: 42 })

log('a regular message')
log.info('an info message')
log.warn('a warning')
log.error('an error')
log.debug('a debug message')
