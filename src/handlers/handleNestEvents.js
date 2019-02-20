const handlers = require('./')

async function handleNestEvents(eventData) {
  if (!eventData || !eventData.data) {
    return
  }

  const { cameras, thermostats } = JSON.parse(eventData.data).data

  if (cameras) {
    await handlers.handleCamera(cameras)
  }
  if (thermostats) {
    await handlers.handleThermostat(thermostats)
  }
}

module.exports = handleNestEvents
