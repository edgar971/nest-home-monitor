const chai = require('chai')
const sinonChai = require('sinon-chai')
const sinon = require('sinon')

const config = require('../config')
const nest = require('../src/services/nest')
const publisher = require('../src/publisher')

const { expect } = chai
chai.use(sinonChai)

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

    beforeEach(async () => {
      sandbox.stub(nest, 'fetchThermostatsStats').resolves(nestStats)
      sandbox.stub(config, 'NEST_DEVICE_ID').value(id)
      
      await publisher()
    })

    it('gets the nest metrics', () =>
      expect(nest.fetchThermostatsStats).to.be.calledWithExactly(id))

    it('publishes to influx', () => expect(false).to.be.true)

    afterEach(() => {
      sandbox.restore()
    })
  })
})
