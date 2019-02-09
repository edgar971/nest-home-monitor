const influx = require('influx')
const config = require('../../config')

let influxInstance = null

function connectToInflux() {
  if (influxInstance) {
    return influxInstance
  }

  influxInstance = new influx.InfluxDB({
    host: config.INFLUX_HOST,
    database: config.INFLUX_DATABASE,
  })

  return influxInstance
}

module.exports = {
  connectToInflux,
}
