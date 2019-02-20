const influxRepo = require('../repositories/influx')

function mapToInfluxPoints(data) {
  return Object.values(data).map(entry => ({
    measurement: 'thermostats',
    tags: { device_id: entry.device_id, name: entry.name },
    fields: {
      currentTemp: entry.ambient_temperature_f,
      targetTemp: entry.target_temperature_high_f,
      humidity: entry.humidity,
    },
    timestamp: new Date().getTime(),
  }))
}

async function handleThermostat(data) {
  const influxPoints = mapToInfluxPoints(data)

  if (!!influxPoints.length) {
    await influxRepo.sendToInflux(influxPoints)
  }
}

module.exports = handleThermostat
