'use strict'

const body = require('../node_modules/reserve/body') // https://github.com/ArnaudBuchholz/reserve/issues/16
const { start } = require('../uploads')

module.exports = async (request, response) => {
  response.writeHead(200, {
    'content-type': 'application/json'
  })
  const { key } = JSON.parse(await body(request))
  const upload = await start(key)
  response.end(JSON.stringify(upload))
}
