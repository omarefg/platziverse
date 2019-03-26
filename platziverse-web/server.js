'use strict'

const debug = require('debug')('platziverse:web')
const http = require('http')
const express = require('express')
const socketio = require('socket.io')
const chalk = require('chalk')
const path = require('path')
const utils = require('platziverse-utils')
const PlatziverseAgent = require('platziverse-agent')

const { handleFatalError, serverErrorMiddleware } = utils.request
const { pipe } = utils.general
const proxy = require('./proxy')
const port = process.env.PORT || 8080
const app = express()
const server = http.createServer(app)
const io = socketio(server)
const agent = new PlatziverseAgent()

app.use(express.static(path.join(__dirname, 'public')))
app.use('/', proxy)
app.use(serverErrorMiddleware)

io.on('connect', socket => {
    debug(`Connected ${socket.id}`)
  
    pipe(agent, socket)
})

process.on('uncaughtException', handleFatalError)
process.on('unhandledRejection', handleFatalError)

server.listen(port, () => {
    console.log(`${chalk.green('[platziverse-web]')} server listening on port ${port}`)
    agent.connect()
})