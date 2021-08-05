const { join } = require('path')

module.exports = process.env.MICROUPLOAD_STORAGE || join(__dirname, 'storage')
console.log('Storage :', module.exports)
