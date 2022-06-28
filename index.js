require('dotenv').config()
const { check, log, serve } = require('reserve')
check({
  port: process.env.PORT || 8080,
  mappings: [{
    match: '^/upload/start',
    custom: './handlers/start.js'
  }, {
    match: '^/upload/chunk',
    custom: './handlers/chunk.js'
  }, {
    match: '^/upload/end',
    custom: './handlers/end.js'
  }, {
    match: '^/download',
    custom: './handlers/download.js'
  }, {
    match: '^/view/(.*)',
    file: '$1',
    'custom-file-system': './viewfs.js'
  }, {
    match: '^/key',
    custom: './handlers/key.js'
  }, {
    match: '^/(.*)',
    file: './www/$1'
  }]
})
  .then(configuration => log(serve(configuration)))
