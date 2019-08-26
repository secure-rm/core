import { unlink, Options, Callback} from './lib/secure-rm'
import { validIDs, standards, UnlinkStandard } from './lib/standards'
import { write, eventEmitter } from './lib/write'

interface SecureRm {
  (path: string, options?: Options | Callback, callback?: Callback): typeof unlink;
  event: typeof eventEmitter;
  write: typeof write;
  standards: typeof standards;
  validIDs: typeof validIDs;
  UnlinkStandard: typeof UnlinkStandard;
  default: SecureRm;
}

let secureRmExport = <unknown>unlink as SecureRm
secureRmExport.event = eventEmitter
secureRmExport.write = write
secureRmExport.standards = standards
secureRmExport.validIDs = validIDs
secureRmExport.UnlinkStandard = UnlinkStandard
secureRmExport.default = secureRmExport

export = secureRmExport
