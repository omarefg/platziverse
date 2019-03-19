'use strict'

const http = require('http')
const chalk = require('chalk')
const express = require('express')
const utils = require('platziverse-utils')
const debug = require('debug')('platziverse:api')

const { handleFatalError } = utils.request

const api = require('./api')

const port = process.env.PORT || 3000
const app = express()
const server = http.createServer(app)

app.use('/api', api)
app.use((error, req, res, next) => {
  debug(`Error: ${error.message}`)

  if (error.message.match(/not found/)) {
    return res.status(404).send({ error: error.message })
  }

  res.status(500).send({ error: error.message })
})

if (!module.parent) {
  process.on('uncaughtException', handleFatalError)
  process.on('unhandledRejection', handleFatalError)
  server.listen(port, () => {
    console.log(`${chalk.green('[plaziverse-api]')} server listening on port ${port}`)
  })
}

module.exports = server
