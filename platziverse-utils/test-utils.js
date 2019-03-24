'use strict'

const extend = (obj, values) => ({...obj,...values})

module.exports = {
  fixtures: {
    agent: () => {
        const agent = {
          id: 1,
          uuid: 'yyy-yyy-yyy',
          name: 'fixture',
          username: 'platzi',
          hostname: 'test-host',
          pid: 0,
          connected: true,
          createdAt: new Date(),
          updatedAt: new Date()
        }
        const agents = [
          agent,
          extend(agent, {
            id: 2,
            uuid: 'yyy-yyy-yyw',
            connected: false,
            username: 'test'
          }),
          extend(agent, {
            id: 3,
            uuid: 'yyy-yyy-yyx'
          }),
          extend(agent, {
            id: 4,
            uuid: 'yyy-yyy-yyz',
            username: 'test'
          })
        ]
        return {
          single: agent,
          all: agents,
          connected: agents.filter(a => a.connected),
          platzi: agents.filter(a => a.username === 'platzi'),
          byUuid: uuid => agents.filter(a => a.uuid === uuid).shift(),
          findById: id => agents.filter(a => a.id === id).shift()
        }
    },
    metric: () => {
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
      const findByAgentUuid = uuid => metrics.filter(metric => metric.agentId === uuid)
      const findByTypeAgentUuid = (type, uuid) => {
        let metricsToReturn = findByAgentUuid(uuid)
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
      
      return {
        single: metric,
        findAll: metrics,
        findByAgentUuid,
        findByTypeAgentUuid
      }
    }
  }
}
