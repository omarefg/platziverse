'use strict'

const utils = require('platziverse-utils')
const debug = require('debug')('platziverse:mqtt')
const mosca = require('mosca')
const redis = require('redis')
const chalk = require('chalk')
const db = require('platziverse-db')
const logging = s => debug(s)
const { handleFatalError, handleError } = utils.request
const config = utils.db.config(false, logging)
const parsePayload = utils.general.parsePayload

const backend = {
  type: 'redis',
  redis,
  return_buffers: true
}

const settings = {
  port: 1883,
  backend
}

const server = new mosca.Server(settings)

const clients = new Map()

let Agent, Metric

server.on('clientConnected', client => {
  debug(`${chalk.yellow('Client Connected')}: ${client.id}`)
  clients.set(client.id, null)
})

server.on('clientDisconnected', async client => {
  debug(`${chalk.yellow('Client Disconnected')}: ${client.id}`)
  const agent = clients.get(client.id)
  if (agent) {
    // Mark Agent as Disconnected
    agent.connected = false
    try {
      await Agent.createOrUpdate(agent)
    } catch (error) {
      handleError(error)
    }

    clients.delete(client.id)

    server.publish({
      topic: 'agent/disconnected',
      payload: JSON.stringify({
        agent: {
          uuid: agent.uuid
        }
      })
    })
    debug(`${chalk.green(`Client [${client.id}] associated to Agent [${agent.uuid}] marked as disconnected`)}`)
  }
})

server.on('published', async (packet, client) => {
  debug(`${chalk.yellow('Received')}: ${packet.topic}`)
  switch (packet.topic) {
    case 'agent/connected':
    case 'agent/disconnected':
      debug(`${chalk.yellow('Payload')}: ${packet.payload}`)
      break
    case 'agent/message': {
      debug(`${chalk.yellow('Payload')}: ${packet.payload}`)
      const payload = parsePayload(packet.payload)
      if (payload) {
        payload.agent.connected = true
        let agent
        try {
          agent = await Agent.createOrUpdate(payload.agent)
        } catch (error) {
          handleError(error)
        }
        debug(`${chalk.green(`Agent ${agent.uuid} saved`)}`)

        // Notify Agent is connected
        if (!clients.get(client.id)) {
          clients.set(client.id, agent)
          server.publish({
            topic: 'agent/connected',
            payload: JSON.stringify({
              agent: {
                uuid: agent.uuid,
                name: agent.name,
                hostname: agent.hostname,
                pid: agent.pid,
                connected: agent.connected
              }
            })
          })
        }
        //  Store Metrics
        for (let metric of payload.metrics) {
          Metric.create(agent.uuid, metric)
            .then(metric => {
              debug(`${chalk.green(`Metric ${metric.id} saved on Agent ${agent.uuid}`)}`)
            })
            .catch(error => handleError(error))
        }
      }
      break
    }
    default: break
  }
})

server.on('ready', async () => {
  const services = await db(config).catch(handleFatalError)

  Agent = services.Agent

  Metric = services.Metric

  console.log(`${chalk.green('[platziverse-mqtt]')} server is running`)
})

server.on('error', handleFatalError)

process.on('uncaughtException', handleFatalError)
process.on('unhandledRejection', handleFatalError)
