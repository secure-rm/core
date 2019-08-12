const rm = require('..')

describe('Invalid IDs throw:', () => {
  const values = [-1, '1', 10e5, 'string', undefined]
  for (let i = 0; i < values.length; i++) {
    test('ID: ' + values[i], () => {
      expect(() => {
        rm('./testfile', values[i], (err) => {
          if (err) throw err
          console.log('Success!')
        })
      }).toThrow(/not a valid ID/)
    })
  }
})
