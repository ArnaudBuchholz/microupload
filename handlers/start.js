'use strict'

const body = require('reserve/body')
const { start } = require('../uploads')
const sendJSON = require('./sendJSON')

module.exports = async (request, response) => {
  const { key } = JSON.parse(await body(request))
  sendJSON(response, await start(key))
}
