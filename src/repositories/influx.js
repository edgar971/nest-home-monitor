const influxWrapper = require('../wrappers/influx')

async function sendToInflux(dataPoints) {
  influx = influxWrapper.connectToInflux()
  await influx.writePoints(dataPoints, { precision: 'ms' })
}

module.exports = {
  sendToInflux,
}
