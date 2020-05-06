const fs = require('fs-extra')
const path = require('path')
const events = require('events')
const srm = require('..')

const tools = require('./tools')(__dirname, __filename)
const eventEmitter = new events.EventEmitter()

it('Rename the folder with a string of length 12', async () => {
  const folderName = tools.createPath()
  await fs.mkdir(folderName)
  let folderData = await srm.dirMethods.init(folderName, { eventEmitter })
  folderData = await srm.dirMethods.rename(folderData)
  await srm.dirMethods.end(folderData)
  expect(path.basename(folderData.folderName)).toHaveLength(12)
})

afterAll(async () => {
  tools.cleanup()
})
