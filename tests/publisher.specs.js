const chai = require('chai')
const sinonChai = require('sinon-chai')
const chaiExclude = require('chai-exclude')
const sinon = require('sinon')

const config = require('../config')
const nest = require('../src/services/nest')
const publisher = require('../src/publisher')
const influxRepo = require('../src/repositories/influx')

const { expect } = chai
chai.use(sinonChai).use(chaiExclude)

const sandbox = sinon.createSandbox()

context('#publishers specs', () => {
  describe('when publishing stats to influx successfully', () => {
    const id = 'test-id'
    const nestStats = {
      id,
      humidity: 32,
      name: 'Home',
      targetTempInF: 44,
      currentTempInF: 43,
    }
    const influxDataPoints = [
      {
        measurement: 'nest_temperatures',
        tags: { device_id: nestStats.id, name: nestStats.name },
        fields: {
          currentTemp: nestStats.currentTempInF,
          targetTemp: nestStats.targetTempInF,
        },
        timestamp: new Date().getTime(),
      },
    ]

    beforeEach(async () => {
      sandbox.stub(nest, 'fetchThermostatsStats').resolves(nestStats)
      sandbox.stub(config, 'NEST_DEVICE_ID').value(id)
      sandbox.stub(influxRepo, 'sendToInflux').resolves()
      await publisher()
    })

    it('gets the nest metrics', () =>
      expect(nest.fetchThermostatsStats).to.be.calledWithExactly(id))

    it('publishes to influx', () =>
      expect(influxRepo.sendToInflux.args[0][0])
        .excluding('timestamp')
        .to.deep.equal(influxDataPoints))

    afterEach(() => {
      sandbox.restore()
    })
  })

  describe('when the api results null', () => {
    const id = 'test-id'
    beforeEach(async () => {
      sandbox.stub(nest, 'fetchThermostatsStats').resolves(null)
      sandbox.stub(config, 'NEST_DEVICE_ID').value(id)
      sandbox.stub(influxRepo, 'sendToInflux').resolves()
      await publisher()
    })

    it('gets the nest metrics', () =>
      expect(nest.fetchThermostatsStats).to.be.calledWithExactly(id))

    it('does not publish to influx', () =>
      expect(influxRepo.sendToInflux).to.not.be.called)

    afterEach(() => {
      sandbox.restore()
    })
  })
})
