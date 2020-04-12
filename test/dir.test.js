const fs = require('fs-extra')
const path = require('path')
const srm = require('..')

const tools = require('./tools')(__dirname, __filename)

it('Rename the folder with a string of length 12', async () => {
  let folderName = tools.createPath()
  await fs.mkdir(folderName)
  folderName = await srm.dirMethods.rename(folderName)
  expect(path.basename(folderName)).toHaveLength(12)
})

afterAll(async () => {
  tools.cleanup()
})
