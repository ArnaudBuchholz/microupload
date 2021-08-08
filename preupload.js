'use strict'

const { promisify } = require('util')
const { Readable } = require('stream')
const pipeline = promisify(require('stream').pipeline)
const { createReadStream, createWriteStream } = require('fs')
const { readdir, stat } = require('fs').promises
const { encrypt: kaosEncrypt, key: kaosKey } = require('kaos')
const { v4: uuidv4 } = require('uuid')
const { nanoid } = require('nanoid')
const { join } = require('path')

function encrypt (source, destination, key) {
  return pipeline(
    createReadStream(source),
    kaosEncrypt(key),
    createWriteStream(destination)
  )
}

async function main () {
  if (process.argv.length < 4) {
    console.log(`preupload <source> <target> <filter>? <mapping>? <mapkey>?
where: <source> = source path
       <target> = target path
       <filter> = regexp to filter source files
       <mapping> = name of the file containing mappings
       <mapkey> = key to encode mapping file`)
    process.exit(-1)
  }
  const [,, source, target, filter, mapping, mapLiteralKey] = process.argv

  const filterRegex = new RegExp(filter || '.*')
  const files = {}
  const fileNames = await readdir(source)
  let count = 0
  for await (const fileName of fileNames) {
    const fileStat = await stat(join(source, fileName), { bigint: true })
    if (fileStat.isFile() && fileName.match(filterRegex)) {
      files[fileName] = fileStat.size
      ++count
    }
  }

  let mapKey
  let saltedMapKey
  let mappingSize
  if (mapLiteralKey) {
    mapKey = kaosKey(mapLiteralKey)
    try {
      const mapStat = await stat(mapping)
      const mapSaltRange = await mapKey.saltRange()
      saltedMapKey = await mapKey.salt(createReadStream(mapping, mapSaltRange))
      mappingSize = mapStat.size - (mapSaltRange.end - mapSaltRange.start + 1)
    } catch (e) {
      saltedMapKey = await mapKey.salt()
      mappingSize = 0
    }
  }

  let index = 0
  for await (const fileName of Object.keys(files)) {
    ++index
    const fileSize = files[fileName]
    const key = nanoid(32)
    const outputName = uuidv4()
    const progress = `${index}/${count}`
    const report = `${fileName} ${fileSize} ${outputName} ${key}`
    if (mapping && mapLiteralKey) {
      console.log(progress)
      const readable = Readable.from([report, '<br>'])
      if (mappingSize) {
        await pipeline(
          readable,
          kaosEncrypt(saltedMapKey, mappingSize),
          createWriteStream(mapping, { flags: 'a' })
        )
      } else {
        await pipeline(
          readable,
          kaosEncrypt(saltedMapKey),
          createWriteStream(mapping)
        )
      }
      mappingSize += report.length + 4
    } else {
      console.log(progress, report)
    }
    await encrypt(join(source, fileName), join(target, outputName), key)
  }
}

main()
