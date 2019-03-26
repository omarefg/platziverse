'use strict'

const express = require('express')
const request = require('request-promise-native')

const api = express.Router()

const { endpoint, apiToken } = require('./config')

const getSharedOptions = {
    method: 'GET',
    headers: { 'Authorization': `Bearer ${apiToken}` },
    json: true
}

api.get('/agents', async (req, res, next) => {
    const options = { ...getSharedOptions, url: `${endpoint}/api/agents` }
    let result
    try {
        result = await request(options)
    } catch (error) {
        next(error)
    }

    res.send(result)

})
api.get('/agent/:uuid', async (req, res, next) => {
    const { uuid } = req.params
    const options = { ...getSharedOptions, url: `${endpoint}/api/agent/${uuid}` }
    let result
    try {
        result = await request(options)
    } catch (error) {
        next(error)
    }

    res.send(result)
})
api.get('/metrics/:uuid', async (req, res, next) => {
    const { uuid } = req.params
    const options = { ...getSharedOptions, url: `${endpoint}/api/metrics/${uuid}` }
    let result
    try {
        result = await request(options)
    } catch (error) {
        next(error)
    }

    res.send(result)
})
api.get('/metrics/:uuid/:type', async (req, res, next) => {
    const { uuid, type } = req.params
    const options = { ...getSharedOptions, url: `${endpoint}/api/metrics/${uuid}/${type}` }
    let result
    try {
        result = await request(options)
    } catch (error) {
        next(error)
    }

    res.send(result)
})

module.exports = api