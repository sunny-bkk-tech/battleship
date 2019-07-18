const request = require('supertest-as-promised')
const httpStatus = require('http-status')
const chai = require('chai')
const { expect } = require('chai')
const { describe, it } = require('mocha')
const app = require('../app')

chai.config.includeStack = true

describe('## Misc', () => {
  describe('# GET /welcome', () => {
    it('should return OK', (done) => {
      request(app)
        .get('/welcome')
        .expect(httpStatus.OK)
        .then((res) => {
          expect(res.text).to.equal('Welcome to BattleShip')
          done()
        })
        .catch(done)
    })
  })
})
