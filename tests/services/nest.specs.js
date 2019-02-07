const chai = require('chai')
const sinonChai = require('sinon-chai')
const sinon = require('sinon')
const axios = require('axios')

const { fetchThermostatsStats } = require('../../src/services/nest')
const config = require('../../config')

const { expect } = chai
chai.use(sinonChai)

const sandbox = sinon.createSandbox()

context('#services/nest specs', () => {
  const id = 'dfdf50695kkfl3gfgf551'
  const getUrl = `https://developer-api.nest.com/devices/thermostats/${id}`
  const getOptions = {
    headers: {
      Authorization: 'Bearer 1234',
    },
  }
  const nestResponse = {
    humidity: 30,
    device_id: 'RQbDOH0dC0jjof2pAv3sGO7at17fr0Sf',
    name: 'Living Room',
    target_temperature_c: 21,
    target_temperature_f: 70,
    target_temperature_high_c: 24,
    target_temperature_high_f: 75,
    target_temperature_low_c: 20,
    target_temperature_low_f: 68,
    ambient_temperature_c: 21.5,
    ambient_temperature_f: 71,
  }

  beforeEach(async () => {
    sandbox.stub(config, 'NEST_AUTHORIZATION_KEY').value(1234)
  })

  afterEach(() => {
    sandbox.restore()
  })

  describe('when fetching data from the nest API successfully', () => {
    let results

    const expectedResponse = {
      id: nestResponse.device_id,
      humidity: nestResponse.humidity,
      name: nestResponse.name,
      targetTempInF: nestResponse.target_temperature_f,
      currentTempInF: nestResponse.ambient_temperature_f,
    }

    beforeEach(async () => {
      sandbox.stub(axios, 'get').resolves({ data: nestResponse })
      results = await fetchThermostatsStats(id)
    })

    it('call the nest api', () =>
      expect(axios.get).to.be.calledWithExactly(getUrl, getOptions))
    it('returns the expected data', () =>
      expect(results).to.deep.equal(expectedResponse))
  })
  describe('when the nest api fails', () => {
    let results
    beforeEach(async () => {
      sandbox.stub(axios, 'get').rejects()
      results = await fetchThermostatsStats(id)
    })

    it('returns null', () => expect(results).to.be.null)
  })
})
