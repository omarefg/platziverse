'use strict'

const test = require('ava')
const proxyquire = require('proxyquire')
const sinon = require('sinon')

let config = {
  loggin: function () {}
}

let MetricStub = {
  belongsTo: sinon.spy()
}

let AgentStub = null
let db = null
let sandbox = null

let metric = {
  type: 'test',
  value: 'test'
}

test.beforeEach(async () => {
  AgentStub.create = sandbox.stub()
  AgentStub.create.withArgs(metric).returns(Promise.resolve(agentFixtures.findById(id)))


  sandbox = sinon.createSandbox()
  AgentStub = {
    hasMany: sandbox.spy()
  }
  const setupDatabase = proxyquire('../', {
    './models/agent': () => AgentStub,
    './models/metric': () => MetricStub
  })
  db = await setupDatabase(config)
})

test.afterEach(() => {
  sandbox && sinon.restore()
})

test('Metric', t => {
  t.truthy(db.Metric, 'Metric service should exist')
})

test.serial('Setup', t => {
  t.true(MetricStub.belongsTo.called, 'MetricModel.belongsTo was executed')
  t.true(MetricStub.belongsTo.calledWith(AgentStub), 'Argument should be the AgentModel')
})

test.serial('Metric#create', t => {
  t.true(MetricStub.create.called('created should be called'))
})