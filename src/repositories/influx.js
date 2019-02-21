const influxWrapper = require('../wrappers/influx')

async function writeToInflux(dataPoints) {
  try {
    influx = await influxWrapper.connectToInflux()
    await influx.writePoints(dataPoints, { precision: 'ms' })
  } catch (error) {
    console.log(`Connecting or sending to influx failed: ${error.message}`)
  }
}

module.exports = {
  writeToInflux,
}
