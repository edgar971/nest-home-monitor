const chai = require('chai')
const sinonChai = require('sinon-chai')
const sinon = require('sinon')

const influxWrapper = require('../../src/wrappers/influx')
const { writeToInflux } = require('../../src/repositories/influx')

const { expect } = chai
chai.use(sinonChai)

const sandbox = sinon.createSandbox()

context('#services/repositories/writeToInflux specs', () => {
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

      await writeToInflux(points)
    })

    afterEach(() => {
      sandbox.restore()
    })

    it('write the metrics to influx', () =>
      expect(influxWriteStub).to.be.calledWithExactly(points, {
        precision: 'ms',
      }))
  })
  describe('when failing to connect to infux', () => {
    beforeEach(async () => {
      influxWriteStub = sandbox.stub().rejects()
      sandbox.stub(console, 'error')

      sandbox
        .stub(influxWrapper, 'connectToInflux')
        .returns({ writePoints: influxWriteStub })

      await writeToInflux([])
    })

    afterEach(() => {
      sandbox.restore()
    })
    it('write the metrics to influx', () =>
      expect(influxWriteStub).to.be.calledWithExactly([], {
        precision: 'ms',
      }))
    it('logs to the console', () => expect(console.error).to.be.called)
  })
})
