'use strict'

const { promisify } = require('util')
const { join } = require('path')
const pipeline = promisify(require('stream').pipeline)
const { createReadStream } = require('fs')
const { decrypt } = require('kaos')
const storage = require('./storage')

module.exports = (id, literalKey, response) => pipeline(
  createReadStream(join(storage, id)),
  decrypt(literalKey),
  response
)
