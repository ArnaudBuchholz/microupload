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
  const ui = byId('uploads').appendChild(document.createElement('div'))
  ui.innerHTML = byId('template').innerHTML
  ui.querySelector('.input-group-text').innerHTML = name
  const info = await post('/upload/start', { 'x-key': key }, { name, size })
  ui.querySelector('.form-control').value = info.id
  const progress = ui.querySelector('.upload-progress')
  let offset = 0
  while (offset < size) {
    const percent = Math.floor(100 * offset / size)
    progress.innerHTML = `${percent}%`
    const length = Math.min(info.chunk, size - offset)
    await post('/upload/chunk', { 'x-upload-id': info.id, 'x-upload-offset': offset }, await read(file, offset, length))
    offset += length
  }
  progress.innerHTML = '&#9989;'
  await post('/upload/end', { 'x-upload-id': info.id })
})

byId('download').addEventListener('click', async () => {
  byId('download-key').value = byId('key').value
  byId('download-id').value = byId('fileToDownload').value
  byId('download-form').submit()
})
