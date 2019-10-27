import { remove, Options, Callback } from './secure-rm'// eslint-disable-line no-unused-vars
import { validIDs, standards, Standard } from './standards'
import { eventEmitter } from './events'
import Unlink from './unlink'
import RmDir from './rmdir'

interface SecureRm {
  (path: string, options?: Options | Callback, callback?: Callback): typeof remove
  event: typeof eventEmitter
  standards: typeof standards
  validIDs: typeof validIDs
  Unlink: typeof Unlink
  RmDir: typeof RmDir
  Standard: typeof Standard
  default: SecureRm
}

const secureRmExport = <unknown>remove as SecureRm
secureRmExport.event = eventEmitter
secureRmExport.standards = standards
secureRmExport.validIDs = validIDs
secureRmExport.Unlink = Unlink
secureRmExport.RmDir = RmDir
secureRmExport.Standard = Standard
secureRmExport.default = secureRmExport

export = secureRmExport
