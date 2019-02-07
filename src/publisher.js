const config = require('../config/index')
const nest = require('./services/nest')

async function publisher() {
  const deviceId = config.NEST_DEVICE_ID
  await nest.fetchThermostatsStats(deviceId)
}

module.exports = publisher
