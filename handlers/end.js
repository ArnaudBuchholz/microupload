'use strict'

const body = require('reserve/body')
const { end } = require('../uploads')

module.exports = async (request, response) => {
  await end(await body(request).id)
  response.writeHead(200, {
    'content-type': 'application/json'
  })
  response.end('{}')
}
