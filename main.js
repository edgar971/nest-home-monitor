const publisher = require('./src/publisher')
const config = require('./config')

setInterval(async () => {
  await publisher()
  console.info('Sent to influx')
}, config.PUBLISH_INTERVAL)
