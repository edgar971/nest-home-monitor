const chai = require('chai')
const sinonChai = require('sinon-chai')
const sinon = require('sinon')

const influxWrapper = require('../../src/wrappers/influx')
const { sendToInflux } = require('../../src/repositories/influx')

const { expect } = chai
chai.use(sinonChai)

const sandbox = sinon.createSandbox()

context('#services/repositories/sendToInflux specs', () => {
  describe('when sending metrics to influx', () => {
    const points = [
      {
        measurement: 'abc',
        tags: { name: 'test' },
        fields: { value: 19.1 },
        timestamp: new Date().getTime(),
      },
      {
        measurement: 'abc',
        tags: { name: 'test' },
        fields: { value: 123 },
        timestamp: new Date().getTime(),
      },
    ]

    let influxWriteStub

    beforeEach(async () => {
      influxWriteStub = sandbox.stub()
      sandbox
        .stub(influxWrapper, 'connectToInflux')
        .returns({ writePoints: influxWriteStub })

      await sendToInflux(points)
    })

    afterEach(() => {
      sandbox.restore()
    })

    it('write the metrics to influx', () =>
      expect(influxWriteStub).to.be.calledWithExactly(points, {
        precision: 'ms',
      }))
  })
})
