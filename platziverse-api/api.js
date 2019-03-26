'use strict'

const utils = require('platziverse-utils')
const debug = require('debug')('platziverse:api:routes')
const dbDebug = require('debug')('platziverse:api:db')
const express = require('express')
const auth = require('express-jwt')
const db = require('platziverse-db')
const guard = require('express-jwt-permissions')()
const logging = s => dbDebug(s)
const config = utils.db.config(false, logging)
const chalk = require('chalk')
const authConfig = utils.auth

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

api.get('/agents', auth(authConfig), async (req, res, next) => {
  debug(`My Lord, a request to /agents has been done`)

  const { user } = req

  if (!user || !user.username) {
    return next(new Error('Not authorized'))
  }

  let agents = []
  try {
    if (user.admin) {
      agents = await Agent.findConnected()
    } else {
      agents = await Agent.findByUsername(user.username)
    }
  } catch (error) {
    return next(error)
  }
  res.status(200).send(agents)
})

api.get('/agent/:uuid', auth(authConfig), async (req, res, next) => {
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

api.get('/metrics/:uuid', auth(authConfig), guard.check(['metrics:read']), async (req, res, next) => {
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

api.get('/metrics/:uuid/:type', auth(authConfig), async (req, res, next) => {
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
