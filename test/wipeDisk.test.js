const fs = require('fs-extra')
var os = require('os')
const { exec } = require('child_process')
const srm = require('..')

test.todo('Check disk functions')

const onWindows = os.platform() === 'win32'
const onWindowsDescribe = onWindows ? describe : describe.skip

function execute (command) {
  return new Promise((resolve, reject) => {
    exec(command, (err, stdout, _stderr) => err ? reject(err) : resolve(stdout))
  })
}

beforeAll(async () => {
  if (onWindows) {
    await execute('diskpart /s ./test/scripts/create-diskpart.txt')
  }
})

jest.setTimeout(1000 * 60 * 5) // in milliseconds

onWindowsDescribe('Universal function', () => {
  describe('Callback', () => {
    it('works without options', done => {
      srm.wipeDisk('\\\\.\\PhysicalDrive1', 104857600, (err) => {
        expect(err).toBeNull()
        done()
      })
    })
  })

  describe('Callback', () => {
    it('works with options', done => {
      srm.wipeDisk('\\\\.\\PhysicalDrive1', 104857600, { chunkSize: 1024 * 1024 * 16 }, (err) => {
        expect(err).toBeNull()
        done()
      })
    })
  })

  describe('Promise', () => {
    it('works without options', done => {
      srm.wipeDisk('\\\\.\\PhysicalDrive1', 104857600).result
        .then(() => done())
        .catch(err => expect(err).toBeNull())
    })
  })

  describe('Promise', () => {
    it('works with options', done => {
      srm.wipeDisk('\\\\.\\PhysicalDrive1', 104857600, { chunkSize: 1024 * 1024 * 16 }).result
        .then(() => done())
        .catch(err => expect(err).toBeNull())
    })
  })

  for (const key in srm.standards) {
    if (key === 'mark') continue
    const standard = srm.standards[key]
    describe('Each disk standard ends:', () => {
      it('ID: ' + key, done => {
        srm.wipeDisk('\\\\.\\PhysicalDrive1', 104857600, { standard }).result
          .then(() => done())
          .catch(err => expect(err).toBeNull())
      })
    })
  }

  describe.only('Each disk standard ends:', () => {
    it('ID: mark', done => {
      srm.wipeDisk('\\\\.\\PhysicalDrive1', 104857600, { standard: srm.standards.mark }).result
        .then(() => expect(false).toBeTrue())
        .catch(err => {
          expect(err).toMatchObject({ code: 'EWIPE' })
          done()
        })
    })
  })
})

afterAll(async () => {
  if (onWindows) {
    await execute('diskpart /s ./test/scripts/remove-diskpart.txt')
    fs.unlink('c:\\virtual-disk1.vhd')
  }
})
