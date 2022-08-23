'use strict'

const storage = require('../storage')
const sendJSON = require('./sendJSON')
const checkDiskSpace = require('check-disk-space').default

module.exports = async (request, response) => {
  sendJSON(response, await checkDiskSpace(storage))
}
