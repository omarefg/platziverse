'use strict'

const test = require('ava')
const request = require('supertest')

const server = require('../server')


test.serial.cb('/api/agents', t => {
    request(server)
        .get('api/agents')
        .expect(200)
        .expect('Content-Type', /json/)
        .end((err, res) => {
            t.falsy(err, 'Should not return an error')
            let body = res.body
            t.deepEqual(body, {}, 'Response body should be the expected')
            t.end()
        })
})