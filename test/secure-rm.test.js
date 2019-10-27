const fs = require('fs')
const srm = require('..')

const { tools } = require('./tools.js')(__dirname, __filename)

describe('Invalid IDs throw:', () => {
  const values = [-1, '1', 10e5, 'string', 'SECURE', ['secure']]
  for (let i = 0; i < values.length; i++) {
    test('ID: ' + values[i], () => {
      expect(() => {
        srm('./testfile', { standard: values[i] }, (err) => {
          if (err) throw err
        })
      }).toThrow(/not a valid ID/)
    })
  }
})

describe('Every syntax allowed:', () => {
  test('Callback without options', done => {
    const folderName = tools.createPath()
    tools.fill(2, 2, 1, folderName)
    expect(fs.statSync(folderName).isDirectory()).toBeTruthy()

    srm(folderName, (err) => {
      if (err) throw err
      expect(() => fs.statSync(folderName)).toThrow()
      done()
    })
  })

  test('Callback with options', done => {
    const folderName = tools.createPath()
    tools.fill(2, 2, 1, folderName)
    expect(fs.statSync(folderName).isDirectory()).toBeTruthy()

    srm(folderName, {
      standard: 'secure',
      maxBusyTries: 4,
      emfileWait: 1001,
      disableGlob: false,
      glob: true
    }, (err) => {
      if (err) throw err
      expect(() => fs.statSync(folderName)).toThrow()
      done()
    })
  })

  test('Promise without options', done => {
    const folderName = tools.createPath()
    tools.fill(2, 2, 1, folderName)
    expect(fs.statSync(folderName).isDirectory()).toBeTruthy()

    srm(folderName)
      .then(() => {
        expect(() => fs.statSync(folderName)).toThrow()
        done()
      })
  })

  test('Promise with options', done => {
    const folderName = tools.createPath()
    tools.fill(2, 2, 1, folderName)
    expect(fs.statSync(folderName).isDirectory()).toBeTruthy()

    srm(folderName, {
      standard: 'secure',
      maxBusyTries: 4,
      emfileWait: 1001,
      disableGlob: false,
      glob: true
    })
      .then(() => {
        expect(() => fs.statSync(folderName)).toThrow()
        done()
      })
  })
})

test('Custom Standard', done => {
  const folderName = tools.createPath()
  tools.fill(2, 2, 1, folderName)
  expect(fs.statSync(folderName).isDirectory()).toBeTruthy()

  srm(folderName, {
    customStandard: new srm.Standard({
      unlinkStandard: new srm.Unlink()
        .byte(0x45)
        .byteArray([0x12, 0x36])
        .complementary()
        .forByte({
          init: 0x01,
          condition: i => i < 0x05,
          increment: i => i + 0x02
        })
        .ones()
        .random()
        .randomByte()
        .rename()
        .truncate()
        .zeroes()
        .unlink()
    })
  }, (err) => {
    if (err) throw err
    expect(() => fs.statSync(folderName)).toThrow()
    done()
  })
})

test('Bulk task', done => {
  const folderName = tools.createPath()
  tools.fill(5, 5, 2, folderName)
  expect(fs.statSync(folderName).isDirectory()).toBeTruthy()

  srm(folderName, (err) => {
    if (err) throw err
    expect(() => fs.statSync(folderName)).toThrow()
    done()
  })
})

afterAll(done => {
  tools.cleanup(done)
})
