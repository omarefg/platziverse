'use strict'

const extend = require('../utils').extend;

const metric = {
    type: 'single',
    value: 'singleValue',
    agentId: 'yyy-yyy-yyy'
  }

const metrics = [
  metric,
  extend(metric, {
    type: 'double'
  }),
  extend(metric, {
    value: 'doubleValue'
  })
]

module.exports = {
  single: metric,
  all: metrics,
  connected: agents.filter(a => a.connected),
  platzi: agents.filter(a => a.username === 'platzi'),
  byUuid: uuid => agents.filter(a => a.uuid === uuid).shift(),
  findById: id => agents.filter(a => a.id === id).shift()
}