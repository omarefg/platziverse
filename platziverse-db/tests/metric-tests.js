'use strict'

const test = require('ava')
const proxyquire = require('proxyquire')
const sinon = require('sinon')
const metricFixtures = require('./fixtures/metric')
const agentFixtures = require('./fixtures/agent')

let config = { loggin: function () {} }
let MetricStub = null
let AgentStub = null
let db = null
let sandbox = null
let uuidArgs = { where: { uuid: 'yyy-yyy-yyy' } }
let newMetric = {
  type: 'memory',
  value: 'singleValue',
  agentId: 'yyy-yyy-yyy',
  id: 1
}
let metricToCreate = {
  type: 'memory',
  value: 'singleValue',
  agentId: 'yyy-yyy-yyy'
}
let findAllUuidArgs = {
  attributes: [ 'type' ],
  group: [ 'type' ],
  include: [{
    attributes: [],
    model: AgentStub,
    ...uuidArgs
  }],
  raw: true
}
let findAllTypeArgs = {
  attributes: ['id', 'type', 'value', 'createdAt'],
  where: {
    type: 'memory'
  },
  limit: 20,
  order: [['createdAt', 'DESC']],
  include: [{
    attributes: [],
    model: AgentStub,
    ...uuidArgs,
    raw: true
  }]
}

test.beforeEach(async () => {
  sandbox = sinon.createSandbox()
  MetricStub = { belongsTo: sandbox.spy() }
  AgentStub = { hasMany: sandbox.spy() }

  AgentStub.findOne = sandbox.stub()
  MetricStub.create = sandbox.stub()
  MetricStub.findAll = sandbox.stub()

  AgentStub.findOne.withArgs(uuidArgs).returns(Promise.resolve(agentFixtures.byUuid(metricFixtures.single.agentId)))
  MetricStub.create.withArgs(metricToCreate).returns(Promise.resolve({ toJSON () { return newMetric } }))
  MetricStub.findAll.withArgs().returns(Promise.resolve(metricFixtures.findAll))
  MetricStub.findAll.withArgs(findAllUuidArgs).returns(Promise.resolve(metricFixtures.findByAgentUuid(metricFixtures.single.agentId)))
  MetricStub.findAll.withArgs(findAllTypeArgs).returns(Promise.resolve(metricFixtures.findByTypeAgentUuid(metricFixtures.single.type, metricFixtures.single.agentId)))

  findAllUuidArgs.include[0].model = AgentStub;
  findAllTypeArgs.include[0].model = AgentStub;

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
  t.true(AgentStub.hasMany.called, 'AgentModel.hasMany was executed')
  t.true(AgentStub.hasMany.calledWith(MetricStub), 'Argument should be the MetricModel')
})

test.serial('Metric#create', async t => {
  const metric = await db.Metric.create(metricFixtures.single.agentId, metricToCreate)
  t.true(AgentStub.findOne.called, 'AgentModel.findOne should be called')
  t.true(MetricStub.create.called, 'MetricModel.create should be called')
  t.deepEqual(metric, metricFixtures.single, 'Should be the same');
})

test.serial('Metric#findByAgentUuid', async t => {
  const metric = await db.Metric.findByAgentUuid(metricFixtures.single.agentId)
  t.true(MetricStub.findAll.called, 'MetricModel.findAll should be called')
  t.true(MetricStub.findAll.calledWith(findAllUuidArgs), 'MetricModel.findAll should be called with uuid args')
  t.deepEqual(metric, metricFixtures.findByAgentUuid(metricFixtures.single.agentId), 'Should be the same');
})
