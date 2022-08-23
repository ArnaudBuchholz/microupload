'use strict'

const body = require('reserve/body')
const { end } = require('../uploads')
const sendJSON = require('./sendJSON')

module.exports = async (request, response) => {
  await end(await body(request).id)
  sendJSON(response, {})
}
