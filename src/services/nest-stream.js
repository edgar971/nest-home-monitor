const EventSource = require('eventsource')

const config = require('.././../config')

function startStreaming(onUpdates, onError) {
  const url = `${config.NEST_API_URL}/devices`
  const headers = {
    Authorization: 'Bearer ' + config.NEST_AUTHORIZATION_KEY,
  }
  const source = new EventSource(url, { headers: headers })

  source.addEventListener('put', onUpdates)

  source.addEventListener('open', function() {
    console.log('Connection opened!')
  })

  source.addEventListener('auth_revoked', function(event) {
    console.log('Authentication token was revoked.')
  })

  source.addEventListener('error', onError, false)
}

module.exports = { startStreaming }
