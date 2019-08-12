const rm = require('..')

test('Invalid IDs throw', () => {
  expect(() => {
    rm('./testfile', -1, (err) => {
      if (err) throw err
      console.log('Success!')
    })
  }).toThrow(/not a valid ID/)
  expect(() => {
    rm('./testfile', 10e5, (err) => {
      if (err) throw err
      console.log('Success!')
    })
  }).toThrow(/not a valid ID/)
})
