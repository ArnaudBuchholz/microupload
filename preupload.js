'use strict'

const { promisify } = require('util')
const pipeline = promisify(require('stream').pipeline)
const { createReadStream, createWriteStream } = require('fs')
const { readdir, stat } = require('fs').promises
const kaosEncrypt = require('kaos').encrypt
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
    console.log(`preupload <source> <target> <filter>?
where: <source> = source path
       <target> = target path
       <filter> = regexp to filter source files`)
    process.exit(-1)
  }
  const [,, source, target, filter] = process.argv
  const files = await readdir(source)
  const filterRegex = new RegExp(filter || '.*')
  for await (const fileName of files) {
    const fileStat = await stat(join(source, fileName), { bigint: true })
    if (!fileStat.isFile() || !fileName.match(filterRegex)) {
      continue
    }
    const key = nanoid(32)
    const outputName = uuidv4()
    console.log(fileName, fileStat.size, outputName, key)
    await encrypt(join(source, fileName), join(target, outputName), key)
  }
}

main()
