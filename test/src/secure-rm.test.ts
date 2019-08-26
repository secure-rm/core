import srm from '../..'

describe('Invalid IDs throw:', () => {
  const values = ['1', 'string', 'SECURE']
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
