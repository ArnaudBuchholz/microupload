'use strict'

const body = require('reserve/body')
const download = require('../download')

module.exports = async (request, response) => {
  const params = /key=([^&]*)&id=(.*)/.exec(await body(request))
  const key = params[1]
  const id = params[2]
  response.writeHead(200, {
    'content-disposition': `attachment; filename=${id}`,
    'content-type': 'application/octet-stream'
  })
  return download(id, key, response)
}
