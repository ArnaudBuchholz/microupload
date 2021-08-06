const storage = require('./storage')
const { key, decrypt } = require('kaos')
const { stat } = require('fs').promises
const { join } = require('path')
const { createReadStream } = require('fs')
const { promisify } = require('util')
const pipeline = promisify(require('stream').pipeline)

// UID-key.extension
const pathParser = /([a-f0-9]{8}\-[a-f0-9]{4}\-[a-f0-9]{4}\-[a-f0-9]{4}\-[a-f0-9]{12})_(.+)\.[^.]+$/i
function parsePath (path) {
  const [, uid, encodedLiteralKey] = pathParser.exec(path)
  return { uid, literalKey: decodeURIComponent(encodedLiteralKey) }
}

module.exports = {
  stat: async path => {
    const { uid, literalKey } = parsePath(path)
    const fileStat = await stat(join(storage, uid))
    return {
      mtime: fileStat.mtime,
      size: fileStat.size - key.saltLength(literalKey.length),
      isDirectory: () => false
    }
  },
  readdir: async () => [],
  createReadStream: async (path, options) => {
    const { uid, literalKey } = parsePath(path)
    const unsaltedKey = key(literalKey)
    const saltRange = await unsaltedKey.saltRange()
    const fileName = join(storage, uid)
    const saltedKey = await unsaltedKey.salt(createReadStream(fileName, saltRange))
    if (options) {
      const byteRange = saltedKey.byteRange(options.start, options.end)
      return pipeline(
        createReadStream(fileName, byteRange),
        decrypt(saltedKey, byteRange)
      )
    }
    return pipeline(
      createReadStream(fileName),
      decrypt(saltedKey)
    )
  }
}
