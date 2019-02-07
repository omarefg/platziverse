'use strict'

const test = require('ava')

let config = {
  loggin: function () {}
}
let db = null

test.beforeEach(async () => {
  const setupDatabase = require('../')
  db = await setupDatabase(config)
})

test('Metric', t => {
  t.truthy(db.Metric, 'Metric service should exist')
})
