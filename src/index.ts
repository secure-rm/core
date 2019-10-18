import { unlink, Options, Callback } from './secure-rm'
import { validIDs, standards, UnlinkStandard } from './standards'
import { write, eventEmitter } from './write'

interface SecureRm {
  (path: string, options?: Options | Callback, callback?: Callback): typeof unlink;
  event: typeof eventEmitter;
  write: typeof write;
  standards: typeof standards;
  validIDs: typeof validIDs;
  UnlinkStandard: typeof UnlinkStandard;
  default: SecureRm;
}

const secureRmExport = <unknown>unlink as SecureRm
secureRmExport.event = eventEmitter
secureRmExport.write = write
secureRmExport.standards = standards
secureRmExport.validIDs = validIDs
secureRmExport.UnlinkStandard = UnlinkStandard
secureRmExport.default = secureRmExport

export = secureRmExport
