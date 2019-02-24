'use strict'

const db = require('../')

async function run () {
  const config = {
    database: process.env.DB_NAME || 'platziverse',
    username: process.env.DB_USER || 'platzi',
    password: process.env.DB_PASS || 'platzi',
    host: process.env.DB_HOST || 'localhost',
    dialect: 'postgres'
  }

  const { Agent, Metric } = await db(config).catch(handleFatalError)

  const agent = await Agent.createOrUpdate({
    uuid: 'yyy',
    name: 'test',
    username: 'test',
    hostname: 'test',
    pid: 1,
    connected: true
  }).catch(handleFatalError)

  const agents = await Agent.findAll().catch(handleFatalError)

  const metrics = await Metric.findByAgentUuid(agent.uuid).catch(handleFatalError)

  const metric = await Metric.create(agent.uuid, {
    type: 'memory',
    value: '300'
  }).catch(handleFatalError)

  const agentMetrics = await Metric.findByTypeAgentUuid('memory', agent.uuid).catch(handleFatalError)

  console.log('---agent---')
  console.log(agents)

  console.log('---agents---')
  console.log(agents)

  console.log('---metrics---')
  console.log(metrics)

  console.log('---metric---')
  console.log(metric)

  console.log('---metricssss---')
  console.log(agentMetrics)
}

const handleFatalError = error => {
  console.log(error.message)
  console.log(error.stack)
  process.exit(1)
}

run()
