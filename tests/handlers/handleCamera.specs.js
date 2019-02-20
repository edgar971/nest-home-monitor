const chai = require('chai')
const sinonChai = require('sinon-chai')
const sinon = require('sinon')
const chaiExclude = require('chai-exclude')

const handleCamera = require('../../src/handlers/handleCamera')
const influxRepo = require('../../src/repositories/influx')
const { cameras } = require('../mockData.json')

chai.use(sinonChai).use(chaiExclude)

const { expect } = chai
const sandbox = sinon.createSandbox()

context('#handlers/handleCamera specs', () => {
  beforeEach(() => {
    sandbox.stub(influxRepo, 'sendToInflux').resolves()
  })

  afterEach(() => {
    sandbox.restore()
  })

  describe('when successfully handling data', () => {
    const expectedInfluxPoints = Object.values(cameras).map(entry => ({
      measurement: 'cameras',
      tags: { device_id: entry.device_id, name: entry.name },
      fields: {
        isOnline: entry.is_online,
        isStreaming: entry.is_streaming,
        lastEventTime: entry.last_event.start_time,
      },
      timestamp: new Date().getTime(),
    }))

    beforeEach(async () => {
      await handleCamera(cameras)
    })

    it('saves to influx', () =>
      expect(influxRepo.sendToInflux.args[0][0])
        .excluding('timestamp')
        .to.deep.equal(expectedInfluxPoints))
  })

  describe('when there is no data', () => {
    beforeEach(async () => {
      await handleCamera([])
    })

    it('does not save to influx', () =>
      expect(influxRepo.sendToInflux).to.not.be.called)
  })
})
