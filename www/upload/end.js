'use strict'

const { end } = require('../../uploads')

module.exports = async (request, response) => {
  const id = request.headers['x-upload-id']
  await end(id)
  response.writeHead(200, {
    'content-type': 'application/json'
  })
  response.end('{}')
}
