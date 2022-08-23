'use strict'

module.exports = function (response, object) {
  const json = JSON.stringify(object)
  response.writeHead(200, {
    'content-type': 'application/json',
    'content-length': json.length
  })
  response.end(json)
}
