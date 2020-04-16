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
      await srm.remove(folderName).result
      expect(() => fs.statSync(folderName)).toThrow()
    })

    it('works with options', async () => {
      const folderName = tools.createPath()
      tools.fill(2, 2, 1, folderName)
      expect(fs.statSync(folderName).isDirectory()).toBeTruthy()
      await srm.remove(folderName, {
        maxBusyTries: 4
      }).result
      expect(() => fs.statSync(folderName)).toThrow()
    })
  })
})

it('Accept custom standard', async () => {
  const folderName = tools.createPath()
  tools.fill(2, 2, 1, folderName)
  expect(fs.statSync(folderName).isDirectory()).toBeTruthy()

  await srm.remove(folderName, {
    standard: (eventEmitter) => {
      return {
        unlink: function (path, cb) {
          const remove = async () => {
            let fileData = await srm.fileMethods.init(path, eventEmitter)
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
            let folderData = await srm.dirMethods.init(path, eventEmitter)
            folderData = await srm.dirMethods.rename(folderData)
            await srm.dirMethods.end(folderData)
          }
          // @ts-ignore
          remove().then(_ => cb(null)).catch(cb)
        }
      }
    }
  }).result
  expect(() => fs.statSync(folderName)).toThrow()
})

it('return the numbers of files erased', async () => {
  const folderName = tools.createPath()
  tools.fill(2, 2, 1, folderName)
  expect(fs.statSync(folderName).isDirectory()).toBeTruthy()
  const result = await srm.remove(folderName).result
  expect(result.count).toStrictEqual(11)
})

afterAll(async () => {
  tools.cleanup()
})
