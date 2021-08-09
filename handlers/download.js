'use strict'

const body = require('reserve/body')
const download = require('../download')
const mime = require('mime')

module.exports = async (request, response) => {
  const parameters = await body(request)
  const key = /key=([^&]*)/.exec(parameters)[1]
  const id = /id=([^&]*)/.exec(parameters)[1]
  const filename = /filename=([^&]*)/.exec(parameters)[1]
  response.writeHead(200, {
    'content-disposition': `attachment; filename=${filename}`,
    'content-type': mime.getType(filename) || 'application/octet-stream'
  })
  return download(id, key, response)
}
