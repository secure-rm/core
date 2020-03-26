module.exports = {
  unit1: [
    {
      function: 'forByte',
      description: 'Increment by 0x11 from 0x00 to 0xee',
      options: {
        initial: 0x00,
        condition: i => i < 0xff,
        increment: i => i + 0x11
      },
      result: [238, 238, 238, 238, 238, 238, 238, 238, 238, 238]
    },
    {
      function: 'forByte',
      description: 'Increment by 0x10 from 0x00 to 0x45: should not increment past 0x40',
      options: {
        initial: 0x00,
        condition: i => i < 0x45,
        increment: i => i + 0x10
      },
      result: [64, 64, 64, 64, 64, 64, 64, 64, 64, 64]
    }
  ]
}
