'use strict'

const byId = id => document.getElementById(id)

const xhr = (verb, method, headers, body) => {
    
}

byId('upload').addEventListener('click', () => {
  const fileInput = byId('fileToUpload')
  const file = fileInput.files[0]
  const name = file.name
  const size = file.size



})
