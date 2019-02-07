const axios = require('axios')

const config = require('../../config/index')

async function fetchThermostatsStats(id) {
  let results

  try {
    const { data } = await axios.get(
      `https://developer-api.nest.com/devices/thermostats/${id}`,
      {
        headers: { Authorization: `Bearer ${config.NEST_AUTHORIZATION_KEY}` },
      }
    )

    results = {
      id: data.device_id,
      humidity: data.humidity,
      name: data.name,
      targetTempInF: data.target_temperature_f,
      currentTempInF: data.ambient_temperature_f,
    }
  } catch (error) {
    results = null
  }

  return results
}

module.exports = {
  fetchThermostatsStats,
}
