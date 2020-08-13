'use strict'

const byId = id => document.getElementById(id)

async function post (url, headers, body) {
  if (body instanceof Object) {
    body = JSON.stringify(body)
  }
  const response = await fetch(url, {
    method: 'post',
    headers,
    body
  })
  if (!response.ok) {
    throw response.statusText
  }
  return response.json()
}

function read (file, offset, size) {
  const blob = file.slice(offset, offset + size)
  const reader = new FileReader()
  return new Promise(resolve => {
    reader.onload = event => resolve(event.target.result)
    reader.readAsBinaryString(blob)
  })
}

byId('upload').addEventListener('click', async () => {
  const key = byId('key').value
  const fileInput = byId('fileToUpload')
  const file = fileInput.files[0]
  const name = file.name
  const size = file.size
  const type = file.type || 'application/octet-stream'

  const info = await post('/upload/start', { 'x-key': key }, { name, size, type })
  let offset = 0
  while (offset < size) {
    const length = Math.min(info.chunk, size - offset)
    await post('/upload/chunk', { 'x-upload-id': info.id, 'x-upload-offset': offset }, await read(file, offset, length))
    offset += length
  }
  await post('/upload/end', { 'x-upload-id': info.id })
})
