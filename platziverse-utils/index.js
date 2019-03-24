'use strict'

const request = require('./request-utils')
const db = require('./db-utils')
const general = require('./general-utils')
const test = require('./test-utils')

module.exports = {
  request: { ...request },
  db: { ...db },
  general: { ...general },
  test: { ...test }
}
