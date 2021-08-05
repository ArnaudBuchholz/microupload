const { nanoid } = require('nanoid')

module.exports = async (request, response) => {
  response.writeHead(200, {
    'content-type': 'application/json'
  })
  response.end(JSON.stringify(nanoid(32)))
}
