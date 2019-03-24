'use strict'

const test = require('ava')
const request = require('supertest')
const sinon = require('sinon')
const proxyquire = require('proxyquire')
const utils = require('platziverse-utils')
const agentFixtures = utils.test.fixtures.agent()
const metricFixtures = utils.test.fixtures.metric()

const uuid = 'yyy-yyy-yyy'
const type = 'memory'

let sandbox, server, dbStub, api
let agentStub = {}
let metricStub = {}

test.beforeEach(async () => {
  sandbox = sinon.createSandbox()

  dbStub = sandbox.stub()
  dbStub.returns(Promise.resolve({ Agent: agentStub, Metric: metricStub }))

  agentStub.findConnected = sandbox.stub()
  agentStub.findConnected.returns(Promise.resolve(agentFixtures.connected))

  agentStub.findByUuid = sandbox.stub()
  agentStub.findByUuid.withArgs(uuid).returns(Promise.resolve(agentFixtures.byUuid(uuid)))

  metricStub.findByAgentUuid = sandbox.stub()
  metricStub.findByAgentUuid.withArgs(uuid).returns(Promise.resolve(metricFixtures.findByAgentUuid(uuid)))

  metricStub.findByTypeAgentUuid = sandbox.stub()
  metricStub.findByTypeAgentUuid.withArgs(type, uuid).returns(Promise.resolve(metricFixtures.findByTypeAgentUuid(type, uuid)))

  api = proxyquire('../api', { 'platziverse-db': dbStub })
  server = proxyquire('../server', { './api': api })
})

test.afterEach(() => sandbox && sinon.restore())

test.serial.cb('/api/agents', t => {
  request(server)
    .get('/api/agents')
    .end((_err, res) => {
      t.truthy(res.status === 200)
      t.falsy(res.error, 'Should not return an error')
      let body = JSON.stringify(res.body)
      let expected = JSON.stringify(agentFixtures.connected)
      t.deepEqual(body, expected, 'Response body should be the expected')
      t.end()
    })
})

test.serial.cb('/api/agent/:uuid', t => {
  request(server)
    .get('/api/agent/yyy-yyy-yyy')
    .end((_err, res) => {
      t.truthy(res.status === 200)
      t.falsy(res.error, 'Should not return an error')
      let body = JSON.stringify(res.body)
      let expected = JSON.stringify(agentFixtures.byUuid('yyy-yyy-yyy'))
      t.deepEqual(body, expected, 'Response body should be the expected')
      t.end()
    })
})

test.serial.cb('/api/agent/:uuid - not found', t => {
  request(server)
    .get('/api/agent/yyy')
    .end((_err, res) => {
      t.truthy(res.status === 404)
      t.truthy(res.error, 'Should return an error')
      t.end()
    })
})

test.serial.cb('/api/metrics/:uuid', t => {
  request(server)
    .get('/api/metrics/yyy-yyy-yyy')
    .end((_err, res) => {
      t.truthy(res.status === 200)
      t.falsy(res.error, 'Should not return an error')
      let body = JSON.stringify(res.body)
      let expected = JSON.stringify(metricFixtures.findByAgentUuid('yyy-yyy-yyy'))
      t.deepEqual(body, expected, 'Response body should be the expected')
      t.end()
    })
})

test.serial.cb('/api/metrics/:uuid - not found', t => {
  request(server)
    .get('/api/metrics/yyy')
    .end((_err, res) => {
      t.truthy(res.status === 404)
      t.truthy(res.error, 'Should return an error')
      t.end()
    })
})

test.serial.cb('/api/metrics/:uuid/:type', t => {
  request(server)
    .get('/api/metrics/yyy-yyy-yyy/memory')
    .end((_err, res) => {
      t.truthy(res.status === 200)
      t.falsy(res.error, 'Should not return an error')
      let body = JSON.stringify(res.body)
      let expected = JSON.stringify(metricFixtures.findByTypeAgentUuid('memory', 'yyy-yyy-yyy'))
      t.deepEqual(body, expected, 'Response body should be the expected')
      t.end()
    })
})

test.serial.cb('/api/metrics/:uuid/:type - not found', t => {
  request(server)
    .get('/api/metrics/yyyy/memory')
    .end((_err, res) => {
      t.truthy(res.status === 404)
      t.truthy(res.error, 'Should return an error')
      t.end()
    })
})
