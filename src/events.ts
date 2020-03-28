/* istanbul ignore file */
import events from 'events'
import { inspect } from 'util'

export const eventEmitter = new events.EventEmitter()

const debug = process.argv.includes('--debug')
const trace = process.argv.includes('--trace')

if (debug || trace) {
  eventEmitter.on('info', (file, message) => console.log('\x1b[38;2;0;255;255m Info \x1b[39m' + message + ' ' + file))
  eventEmitter.on('debug', (file, message) => console.log('\x1b[38;2;128;0;128m Debug \x1b[39m' + message + ' ' + file))
  if (trace) eventEmitter.on('trace', (data, message) => console.log('\x1b[38;2;0;0;255m Trace \x1b[39m' + message + ' ' + inspect(data, { depth: Infinity, colors: true })))
  // on('warn', (file, message) => console.log('\x1b[38;2;255;255;0m Warn \x1b[39m' + message + file))
  // on('error', (file, message) => console.log('\x1b[38;2;255;0;0m Error \x1b[39m' + message + file))
}
