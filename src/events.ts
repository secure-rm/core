import events from 'events'

export const eventEmitter = new events.EventEmitter()
export const emit = eventEmitter.emit
export const on = eventEmitter.on

const debug = process.argv.includes('--debug')
const trace = process.argv.includes('--trace')

console.log(debug, trace)

if (debug || trace) {
  on('info', (file, message) => console.log('\x1b[38;2;0;0;255m Info \x1b[39m' + message + ' ' + file))
  on('debug', (file, message) => console.log('\x1b[38;2;128;0;128m Debug \x1b[39m' + message + ' ' + file))
  if (trace) on('trace', (data, message) => console.log('\x1b[38;2;0;255;255m Notice \x1b[39m' + message + ' ' + data.toString))
  // on('warn', (file, message) => console.log('\x1b[38;2;255;255;0m Warn \x1b[39m' + message + file))
  // on('error', (file, message) => console.log('\x1b[38;2;255;0;0m Error \x1b[39m' + message + file))
}
