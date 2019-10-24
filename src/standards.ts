import fs from 'fs'
import Unlink from './unlink'
import RmDir from './rmdir'

interface StandardArgs {
  name?: string
  passes?: number
  description?: string
  unlinkStandard: typeof fs.unlink
  rmdirStandard?: typeof fs.rmdir
}

export class Standard {
  name: string
  passes: number
  description: string
  unlinkStandard: typeof fs.unlink
  rmdirStandard: typeof fs.rmdir

  constructor ({ name, passes, description, unlinkStandard, rmdirStandard }: StandardArgs) {
    this.name = name || 'Standard #'
    this.passes = passes || 1
    this.description = description || 'no description'
    this.unlinkStandard = unlinkStandard
    this.rmdirStandard = rmdirStandard || fs.rmdir
  }
}

// Object listing every standards
export const standards = {
  log: new Standard({
    name: 'Log',
    passes: 1,
    description: 'Display targeted files.',
    unlinkStandard: new Unlink()
      .log()
      .compile,
    rmdirStandard: new RmDir()
      .log()
      .compile
  }),

  randomData: new Standard({
    name: 'Pseudorandom data',
    passes: 1,
    description: `Also kwown as "Australian Information Security Manual Standard ISM 6.2.92"
and "New Zealand Information and Communications Technology Standard NZSIT 402" 
Your data is overwritten with cryptographically strong pseudo-random data. (The data is indistinguishable from random noise.)`,
    unlinkStandard: new Unlink()
      .random()
      .unlink()
  }),

  randomByte: new Standard({
    name: 'Pseudorandom byte',
    passes: 1,
    description: 'Overwriting with a random byte.',
    unlinkStandard: new Unlink()
      .randomByte()
      .unlink()
  }),

  zeroes: new Standard({
    name: 'Zeroes',
    passes: 1,
    description: 'Overwriting with zeroes.',
    unlinkStandard: new Unlink()
      .zeroes()
      .unlink()
  }),

  ones: new Standard({
    name: 'Ones',
    passes: 1,
    description: 'Overwriting with ones.',
    unlinkStandard: new Unlink()
      .ones()
      .unlink()
  }),

  secure: new Standard({
    name: '**Secure-rm standard**',
    passes: 3,
    description:
      `Pass 1: Overwriting with random data;
Pass 2: Renaming the file with random data;
Pass 3: Truncating between 25% and 75% of the file.`,
    unlinkStandard: new Unlink()
      .random()
      .rename()
      .truncate()
      .unlink()/* ,
    rmdirStandard: new RmDir()
      .rename()
      .rmdir() */
  }),

  'GOST_R50739-95': new Standard({
    name: 'Russian State Standard GOST R50739-95',
    passes: 2,
    description:
      `Pass 1: Overwriting with zeroes;
Pass 2: Overwriting with random data.`,
    unlinkStandard: new Unlink()
      .zeroes()
      .random()
      .unlink()
  }),

  HMG_IS5: new Standard({
    name: 'British HMG Infosec Standard 5',
    passes: 3,
    description:
      `Also known as "Air Force System Security Instructions AFSSI-5020",
"Standard of the American Department of Defense (DoD 5220.22 M)"
"National Computer Security Center NCSC-TG-025 Standard"
and "Navy Staff Office Publication NAVSO P-5239-26"
Pass 1: Overwriting with zeroes;
Pass 2: Overwriting with ones;
Pass 3: Overwriting with random data as well as verifying the writing of this data.`,
    unlinkStandard: new Unlink()
      .zeroes()
      .ones()
      .random()
      .unlink()
  }),

  'AR380-19': new Standard({
    name: 'US Army AR380-19',
    passes: 3,
    description:
      `Pass 1: Overwriting with random data;
Pass 2: Overwriting with a random byte;
Pass 3: Overwriting with the complement of the 2nd pass, and verifying the writing.`,
    unlinkStandard: new Unlink()
      .random()
      .randomByte()
      .complementary()
      .unlink()
  }),

  VSITR: new Standard({
    name: 'Standard of the Federal Office for Information Security (BSI-VSITR)',
    passes: 7,
    description:
      `Also known as "Royal Canadian Mounted Police TSSIT OPS-II"
Pass 1: Overwriting with zeroes;
Pass 2: Overwriting with ones;
Pass 3-6: Same as 1-2;
Pass 7: Overwriting with a random data as well as review the writing of this character.`,
    unlinkStandard: new Unlink()
      .zeroes()
      .ones()
      .zeroes()
      .ones()
      .zeroes()
      .ones()
      .random()
      .unlink()
  }),

  schneier: new Standard({
    name: 'Bruce Schneier Algorithm',
    passes: 7,
    description:
      `Pass 1: Overwriting with zeros;
Pass 2: Overwriting with ones;
Pass 3-7: Overwriting with random data.`,
    unlinkStandard: new Unlink()
      .zeroes()
      .ones()
      .random(5)
      .unlink()
  }),

  pfitzner: new Standard({
    name: 'Pfitzner Method',
    passes: 33,
    description:
      'Pass 1-33: Overwriting with random data.',
    unlinkStandard: new Unlink()
      .random(33)
      .unlink()
  }),

  gutmann: new Standard({
    name: 'Peter Gutmann Algorithm',
    passes: 35,
    description:
      `Pass 1-4: Overwriting with random data;
Pass 5: Overwriting with 0x55;
Pass 6: Overwriting with 0xAA;
Pass 7-9: Overwriting with 0x92 0x49 0x24, then cycling through the bytes;
Pass 10-25: Overwriting with 0x00, incremented by 1 at each pass, until 0xFF;
Pass 26-28: Same as 7-9;
Pass 29-31: Overwriting with 0x6D 0xB6 0xDB, then cycling through the bytes;
Pass 32-35: Overwriting with random data.`,
    unlinkStandard: new Unlink()
      .random(4)
      .byte(0x55)
      .byte(0xAA)
      .byteArray([0x92, 0x49, 0x24])
      .byteArray([0x49, 0x24, 0x92])
      .byteArray([0x24, 0x92, 0x49])
      .forByte({ init: 0x00, condition: i => i < 0xFF, increment: (obj) => {obj.i += 0x11} })
      .byteArray([0x92, 0x49, 0x24])
      .byteArray([0x49, 0x24, 0x92])
      .byteArray([0x24, 0x92, 0x49])
      .byteArray([0x6D, 0xB6, 0xDB])
      .byteArray([0xB6, 0xDB, 0x6D])
      .byteArray([0xDB, 0x6D, 0xB6])
      .random(4)
      .unlink()
  })
}

// List of valid standards IDs
export const validIDs = <unknown>Object.keys(standards) as keyof typeof standards
