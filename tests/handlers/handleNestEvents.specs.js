const chai = require('chai')
const sinonChai = require('sinon-chai')
const sinon = require('sinon')

const handleNestEvents = require('../../src/handlers/handleNestEvents')
const handlers = require('../../src/handlers')
const nestData = require('../mockData')

chai.use(sinonChai)

const { expect } = chai
const sandbox = sinon.createSandbox()

context('#handles/handleNestEvents specs', () => {
  beforeEach(() => {
    sandbox.stub(handlers)
  })
  afterEach(() => {
    sandbox.restore()
  })

  describe('when handling event successfully', () => {
    beforeEach(async () => {
      const nestResponse = { data: JSON.stringify({ data: nestData }) }
      await handleNestEvents(nestResponse)
    })

    it('calls the camera event handler', () =>
      expect(handlers.handleCamera).to.be.calledWithExactly(nestData.cameras))
    it('calls the thermostat event handler', () =>
      expect(handlers.handleThermostat).to.be.calledWithExactly(
        nestData.thermostats
      ))
  })

  describe('when handling event and data is empty or undefined', () => {
    beforeEach(async () => {
      await handleNestEvents({})
    })

    it('does not call the camera event handler', () =>
      expect(handlers.handleCamera).to.not.be.called)
    it('does not call the thermostat event handler', () =>
      expect(handlers.handleThermostat).to.not.be.called)
  })
})
