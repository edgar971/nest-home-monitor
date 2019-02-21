const handleNestEvents = require('./src/handlers/handleNestEvents')
const handleNestErrors = require('./src/handlers/handleNestErrors')
const nestStream = require('./src/services/nest-stream')

nestStream.startStreaming(async data => {
  console.info(`Received data from nest`)
  await handleNestEvents(data)
}, handleNestErrors)
