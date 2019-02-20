const chai = require('chai')
const sinonChai = require('sinon-chai')
const sinon = require('sinon')
const chaiExclude = require('chai-exclude')

const handleThermostat = require('../../src/handlers/handleThermostat')
const influxRepo = require('../../src/repositories/influx')
const { thermostats } = require('../mockData.json')

chai.use(sinonChai).use(chaiExclude)

const { expect } = chai
const sandbox = sinon.createSandbox()

context('#handlers/handleThermostat specs', () => {
  beforeEach(() => {
    sandbox.stub(influxRepo, 'sendToInflux').resolves()
  })

  afterEach(() => {
    sandbox.restore()
  })

  describe('when successfully handling data', () => {
    const expectedInfluxPoints = Object.values(thermostats).map(entry => ({
      measurement: 'thermostats',
      tags: { device_id: entry.device_id, name: entry.name },
      fields: {
        currentTemp: entry.ambient_temperature_f,
        targetTemp: entry.target_temperature_f,
        sunlightCorrectionActive: entry.sunlight_correction_active,
        sunlightCorrectionEnabled: entry.sunlight_correction_enabled,
        humidity: entry.humidity,
        online: entry.is_online,
      },
      timestamp: new Date().getTime(),
    }))

    beforeEach(async () => {
      await handleThermostat(thermostats)
    })

    it('saves to influx', () =>
      expect(influxRepo.sendToInflux.args[0][0])
        .excluding('timestamp')
        .to.deep.equal(expectedInfluxPoints))
  })

  describe('when there is no data', () => {
    beforeEach(async () => {
      await handleThermostat([])
    })

    it('does not save to influx', () =>
      expect(influxRepo.sendToInflux).to.not.be.called)
  })
})
