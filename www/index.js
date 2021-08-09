'use strict'

const byId = id => document.getElementById(id)

async function post (url, headers, body) {
  if (!headers['content-type']) {
    headers['content-type'] = 'application/json'
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
    reader.readAsArrayBuffer(blob)
  })
}

byId('upload').addEventListener('click', async () => {
  const key = byId('key').value
  const fileInput = byId('fileToUpload')
  const file = fileInput.files[0]
  const name = file.name
  const size = file.size
  const ui = byId('uploads').appendChild(document.createElement('div'))
  ui.innerHTML = byId('template').innerHTML
  ui.querySelector('.input-group-text').innerHTML = name
  const upload = await post('/upload/start', {}, { key })
  ui.querySelector('.form-control').value = upload.id
  const progress = ui.querySelector('.upload-progress')
  let offset = 0
  while (offset < size) {
    const percent = Math.floor(100 * offset / size)
    progress.innerHTML = `${percent}%`
    const length = Math.min(upload.chunk, size - offset)
    await post('/upload/chunk', {
      'content-type': 'application/octet-stream',
      'x-upload-id': upload.id,
      'x-upload-offset': offset
    }, await read(file, offset, length))
    offset += length
  }
  progress.innerHTML = '&#9989;'
  await post('/upload/end', {}, upload)
})

byId('download').addEventListener('click', () => {
  byId('download-key').value = byId('key').value
  byId('download-id').value = byId('fileToDownload').value
  byId('download-filename').value = byId('fileNameToDownload').value
  byId('download-form').submit()
})

byId('view').addEventListener('click', () => {
  const fileName = byId('fileNameToDownload').value
  const extension = /\.[^.]+$/.exec(fileName)[0]
  const url = `/view/${byId('fileToDownload').value}_${encodeURIComponent(byId('key').value)}${extension}`
  window.open(url, '_blank')
})

byId('genKey').addEventListener('click', async () => {
  byId('key').setAttribute('type', 'text')
  byId('key').value = await post('/key', {}, {})
})
