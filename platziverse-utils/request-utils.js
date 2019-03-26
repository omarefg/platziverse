'use strict'

const chalk = require('chalk')
const debug = require('debug')('platziverse:utils:request')

module.exports = {
  handleFatalError: error => {
    console.log(`${chalk.red('[Fatal Error!]')} ${error.message}`)
    console.log(error.stack)
    process.exit(1)
  },
  handleError: error => {
    console.log(`${chalk.red('[Error!]')} ${error.message}`)
    console.log(error.stack)
  },
  serverErrorMiddleware: (error, req, res, next) => {
    debug(`Error: ${error.message}`)
  
    if (error.message.match(/not found/)) {
      return res.status(404).send({ error: error.message })
    }
  
    res.status(500).send({ error: error.message })
  },
}
