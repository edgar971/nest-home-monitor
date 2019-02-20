const handlers = require('./')

async function handleNestEvents(eventData) {
  const { cameras, thermostats } = eventData
  if (cameras) {
    await handlers.handleCamera(cameras)
  }
  if (thermostats) {
    await handlers.handleThermostat(thermostats)
  }
}

module.exports = handleNestEvents
