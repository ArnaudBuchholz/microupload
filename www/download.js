'use strict'

const body = require('../node_modules/reserve/body.js') // https://github.com/ArnaudBuchholz/reserve/issues/16
const download = require('../download')

module.exports = async (request, response) => {
  const params = /key=([^&]*)&id=(.*)/.exec(await body(request))
  const key = params[1]
  const id = params[2]
  response.writeHead(200, {
    'content-type': 'application/octet-stream'
  })
  return download(id, key, response)
}
