'use strict'

const body = require('../node_modules/reserve/body') // https://github.com/ArnaudBuchholz/reserve/issues/16
const { end } = require('../uploads')

module.exports = async (request, response) => {
  await end(await body(request).id)
  response.writeHead(200, {
    'content-type': 'application/json'
  })
  response.end('{}')
}
