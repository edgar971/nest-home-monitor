const influxRepo = require('../repositories/influx')

function mapToInfluxPoints(data) {
  return Object.values(data).map(entry => ({
    measurement: 'cameras',
    tags: { device_id: entry.device_id, name: entry.name },
    fields: {
      isOnline: entry.is_online,
      isStreaming: entry.is_streaming,
      lastEventTime: entry.last_event.start_time,
    },
    timestamp: new Date().getTime(),
  }))
}

async function handleCamera(data) {
  const influxPoints = mapToInfluxPoints(data)

  if (!!influxPoints.length) {
    await influxRepo.sendToInflux(influxPoints)
  }
}

module.exports = handleCamera
