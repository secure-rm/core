const srm = require('..')

describe('Invalid IDs throw:', () => {
  const values = [-1, '1', 10e5, 'string', 'SECURE', ['secure']]
  for (let i = 0; i < values.length; i++) {
    test('ID: ' + values[i], () => {
      expect(() => {
        srm('./testfile', { method: values[i] }, (err) => {
          if (err) throw err
        })
      }).toThrow(/not a valid ID/)
    })
  }
})
