'use strict'

const { chunk } = require('../uploads')
const sendJSON = require('./sendJSON')

module.exports = async (request, response) => {
  const id = request.headers['x-upload-id']
  const offset = parseInt(request.headers['x-upload-offset'] || '0', 10)
  await chunk(id, offset, request)
  sendJSON(response, {})
}
