'use strict'

const { v4: uuidv4 } = require('uuid')
const { promisify } = require('util')
const { key, encrypt } = require('kaos')
const { join } = require('path')
const pipeline = promisify(require('stream').pipeline)
const { createWriteStream } = require('fs')

const uploads = {}

async function start (literalKey) {
  const id = uuidv4()
  uploads[id] = {
    key: await key(literalKey).salt()
  }
  return {
    id,
    chunk: 16 * 1024
  }
}

async function chunk (id, offset, readableStream) {
  const file = uploads[id]
  if (offset === 0) {
    return pipeline(
      readableStream,
      encrypt(file.key),
      createWriteStream(join(__dirname, 'storage', id))
    )
  }
  return pipeline(
    readableStream,
    encrypt(file.key, offset),
    createWriteStream(join(__dirname, 'storage', id), { flags: 'a' })
  )
}

async function end (id) {
  delete uploads[id]
}

module.exports = {
  start,
  chunk,
  end
}
