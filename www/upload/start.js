'use strict'

const body = require('../../node_modules/reserve/body.js') // https://github.com/ArnaudBuchholz/reserve/issues/16
const { start } = require('../../uploads')

module.exports = async (request, response) => {
  const file = await body(request)
  const key = request.headers['x-key']
  response.writeHead(200, {
    'content-type': 'application/json'
  })
  response.end(JSON.stringify(await start(file, key)))
}