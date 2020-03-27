const fs = require('fs-extra')
const srm = require('..')

const tools = require('./tools.js')(__dirname, __filename)

test.todo('Predictable errors')

describe('Universal function', () => {
  describe('Callback', () => {
    it('works without options', done => {
      const folderName = tools.createPath()
      tools.fill(2, 2, 1, folderName)
      expect(fs.statSync(folderName).isDirectory()).toBeTruthy()
      srm.remove(folderName, (err) => {
        if (err) throw err
        expect(() => fs.statSync(folderName)).toThrow()
        done()
      })
    })

    it('works with options', done => {
      const folderName = tools.createPath()
      tools.fill(2, 2, 1, folderName)
      expect(fs.statSync(folderName).isDirectory()).toBeTruthy()
      srm.remove(folderName, {
        maxBusyTries: 4
      }, (err) => {
        if (err) throw err
        expect(() => fs.statSync(folderName)).toThrow()
        done()
      })
    })
  })

  describe('Promise', () => {
    it('works without options', async () => {
      const folderName = tools.createPath()
      tools.fill(2, 2, 1, folderName)
      expect(fs.statSync(folderName).isDirectory()).toBeTruthy()
      await srm.remove(folderName)
      expect(() => fs.statSync(folderName)).toThrow()
    })

    it('works with options', async () => {
      const folderName = tools.createPath()
      tools.fill(2, 2, 1, folderName)
      expect(fs.statSync(folderName).isDirectory()).toBeTruthy()
      await srm.remove(folderName, {
        maxBusyTries: 4
      })
      expect(() => fs.statSync(folderName)).toThrow()
    })
  })
})

it('Accept custom standard', async () => {
  const folderName = tools.createPath()
  tools.fill(2, 2, 1, folderName)
  expect(fs.statSync(folderName).isDirectory()).toBeTruthy()

  await srm.remove(folderName, {
    standard: {
      unlink: function (path, cb) {
        const remove = async () => {
          let fileData = await srm.fileMethods.init(path)
          await srm.fileMethods.byte(fileData, { data: 0x56 })
          await srm.fileMethods.byteArray(fileData, { data: [0x23, 0x15] })
          await srm.fileMethods.changeTimestamps(fileData)
          await srm.fileMethods.complementary(fileData)
          await srm.fileMethods.forByte(fileData, {
            initial: 0x01,
            condition: i => i < 0x05,
            increment: i => i + 0x02
          })
          await srm.fileMethods.ones(fileData)
          await srm.fileMethods.random(fileData)
          await srm.fileMethods.randomByte(fileData)
          fileData = await srm.fileMethods.rename(fileData)
          await srm.fileMethods.resetTimestamps(fileData)
          await srm.fileMethods.truncate(fileData)
          await srm.fileMethods.zeros(fileData)
          await srm.fileMethods.end(fileData)
        }
        // @ts-ignore
        remove().then(_ => cb(null)).catch(cb)
      },
      rmdir: function (path, cb) {
        const remove = async () => {
          path = await srm.dirMethods.rename(path)
          await fs.rmdir(path)
        }
        // @ts-ignore
        remove().then(_ => cb(null)).catch(cb)
      }
    }
  })
  expect(() => fs.statSync(folderName)).toThrow()
})

afterAll(async () => {
  tools.cleanup()
})
