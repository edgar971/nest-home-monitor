const chai = require('chai')
const sinonChai = require('sinon-chai')
const sinon = require('sinon')

const subscriber = require('../src/subscriber')
const nestStream = require('../src/services/nest-stream')
const handleNestEvents = require('../src/handlers/handleNestEvents')
const handleNestErrors = require('../src/handlers/handleNestErrors')

chai.use(sinonChai)

const { expect } = chai
const sandbox = sinon.createSandbox()

context('#subscriber specs', () => {
  afterEach(() => sandbox.restore())
  describe('when subscribing to data', () => {
    beforeEach(async () => {
      sandbox.stub(nestStream, 'startStreaming')
      await subscriber.start()
    })

    it('subscribes to the nest stream', () =>
      expect(nestStream.startStreaming).to.be.calledWithExactly(
        handleNestEvents,
        handleNestErrors
      ))
  })
})
