const handleNestEvents = require('./handlers/handleNestEvents')
const handleNestErrors = require('./handlers/handleNestErrors')

const nestStream = require('./services/nest-stream')
async function start() {
  await nestStream.startStreaming(handleNestEvents, handleNestErrors)
}

module.exports = { start }
