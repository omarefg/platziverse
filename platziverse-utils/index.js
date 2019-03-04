'use strict'

const request = require('./request-utils')
const db = require('./db-utils')
const general = require('./general-utils')

module.exports = {
  request: { ...request },
  db: { ...db },
  general: { ...general }
}
