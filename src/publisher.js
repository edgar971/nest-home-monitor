const config = require('../config/index')
const nest = require('./services/nest')
const influxRepo = require('./repositories/influx')

async function publisher() {
  const deviceId = config.NEST_DEVICE_ID
  const nestStats = await nest.fetchThermostatsStats(deviceId)
  if (nestStats) {
    dataPoints = mapToInfluxPoints(nestStats)
    await influxRepo.sendToInflux(dataPoints)
  } else {
    console.warn('Got null results from API')
  }
}

function mapToInfluxPoints(data) {
  return [
    {
      measurement: 'nest_temperatures',
      tags: { device_id: data.id, name: data.name },
      fields: {
        currentTemp: data.currentTempInF,
        targetTemp: data.targetTempInF,
      },
      timestamp: new Date().getTime(),
    },
  ]
}

module.exports = publisher
