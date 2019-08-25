import { unlink, write, eventEmitter, Options, Callback} from './lib/secure-rm'

interface SecureRm {
  (path: string, options?: Options | Callback, callback?: Callback): typeof unlink;
  event: typeof eventEmitter;
  write: typeof write;
  default: SecureRm
}

let secureRmExport = <unknown>unlink as SecureRm
secureRmExport.event = eventEmitter
secureRmExport.write = write
secureRmExport.default = secureRmExport

export = secureRmExport
