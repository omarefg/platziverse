'use strict'

const utils = require('platziverse-utils')
const debug = require('debug')('platziverse:api:routes')
const dbDebug = require('debug')('platziverse:api:db')
const express = require('express')
const db = require('platziverse-db')
const logging = s => dbDebug(s)
const config = utils.db.config(false, logging)
const chalk = require('chalk')

const api = express.Router()

let services, Agent, Metric

api.use('*', async (req, res, next) => {
  if (!services) {
    try {
      debug(`${chalk.magenta('Conecting to Database...')}`)
      services = await db(config)
      debug(`${chalk.green('Connected')}`)
    } catch (error) {
      debug(`${chalk.red('[Conection error]')}`)
      next(error)
    }
  }
  Agent = services.Agent
  Metric = services.Metric
  next()
})

api.get('/agents', async (req, res, next) => {
  debug(`My Lord, a request to /agents has been done`)
  let agents = []
  try {
    agents = await Agent.findConnected()
  } catch (error) {
    return next(error)
  }
  res.status(200).send(agents)
})

api.get('/agent/:uuid', async (req, res, next) => {
  const { uuid } = req.params
  debug(`My Lord, a request to /agent/${uuid} has been done`)
  let agent = null
  try {
    agent = await Agent.findByUuid(uuid)
  } catch (error) {
    return next(error)
  }
  if (!agent) { return next(Error(`Agent associated to ${uuid} not found`)) }
  res.status(200).send(agent)
})

api.get('/metrics/:uuid', async (req, res, next) => {
  const { uuid } = req.params
  debug(`My Lord, a request to /metrics/${uuid} has been done`)
  let metrics = []
  try {
    metrics = await Metric.findByAgentUuid(uuid)
  } catch (error) {
    return next(error)
  }
  if (!metrics || !metrics.length) { return next(Error(`Metrics associated to ${uuid} not found`)) }
  res.status(200).send(metrics)
})

api.get('/metrics/:uuid/:type', async (req, res, next) => {
  const { uuid, type } = req.params
  debug(`My Lord, a request to /metrics/${uuid}/${type} has been done`)
  let metrics = []
  try {
    metrics = await Metric.findByTypeAgentUuid(type, uuid)
  } catch (error) {
    return next(error)
  }
  if (!metrics || !metrics.length) {
    return next(Error(`Metrics associated to ${uuid} with type ${type} not found`))
  }
  res.status(200).send(metrics)
})

module.exports = api
