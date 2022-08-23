'use strict'

const { nanoid } = require('nanoid')
const sendJSON = require('./sendJSON')

module.exports = async (request, response) => {
  sendJSON(response, nanoid(32))
}
