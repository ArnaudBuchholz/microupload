'use strict'

const body = require('reserve/body')
const { start } = require('../uploads')

module.exports = async (request, response) => {
  response.writeHead(200, {
    'content-type': 'application/json'
  })
  const { key } = JSON.parse(await body(request))
  const upload = await start(key)
  response.end(JSON.stringify(upload))
}
