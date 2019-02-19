'use strict'

const extend = require('../../utils').extend

const metric = {
  type: 'memory',
  value: 'singleValue',
  agentId: 'yyy-yyy-yyy',
  id: 1
}

const metrics = [
  metric,
  extend(metric, {
    type: 'double',
    id: 2,
    agentId: 'yyy-yyy-yyx'
  }),
  extend(metric, {
    value: 'doubleValue',
    id: 3,
    agentId: 'yyy-yyy-yyw'
  }),
  extend(metric, {
    value: 'doubleValue',
    id: 4,
    agentId: 'yyy-yyy-yyy',
    type: 'hardDisk'
  }),
  extend(metric, {
    value: 'doubleValue',
    id: 5,
    agentId: 'yyy-yyy-yyy',
    type: 'hardDisk'
  })
]

const findByTypeAgentUuid = (type, uuid) => {
  let metricsToReturn = metrics.filter(m => m.agentId === uuid)
  if (metricsToReturn.length > 0) {
    metricsToReturn = metricsToReturn.filter(m => m.type === type)
      .map(m => {
        return {
          id: m.id,
          type: m.type,
          value: m.value,
          createdAt: m.createdAt
        }
      })
      .sort((a, b) => b.createdAt - a.createdAt)
      .slice(0, 20)
  }
  return metricsToReturn
}

module.exports = {
  single: metric,
  findAll: metrics,
  findByAgentUuid: uuid => metrics.filter(a => a.agentId === uuid),
  findByTypeAgentUuid
}
