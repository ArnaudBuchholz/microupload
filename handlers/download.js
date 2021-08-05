'use strict'

const body = require('reserve/body')
const download = require('../download')
const mime = require('mime')

module.exports = async (request, response) => {
  const parameters = await body(request)
  const key = /key=([^&]*)/.exec(parameters)[1]
  const id = /id=([^&]*)/.exec(parameters)[1]
  const filename = /filename=([^&]*)/.exec(parameters)[1]
  const downloadOrView = /view=([^&]*)/.exec(parameters)[1]
  const headers = {
    'content-type': mime.getType(filename) || 'application/octet-stream'
  }
  if (downloadOrView === 'download') {
    headers['content-disposition'] = `attachment; filename=${filename}`
  }
  response.writeHead(200, headers)
  return download(id, key, response)
}
