'use strict'

var utils = require('./utils')

function VoaFile (file) {
  if (!(this instanceof VoaFile)) {
    throw new TypeError('VoaFile: expect to be called with `new` keyword')
  }
  if (typeof file !== 'object' && typeof file !== 'string') {
    throw new TypeError('VoaFile: expect `file` be string (the file.path) or object')
  }
  if (typeof file === 'string') {
    file = {path: file}
  }
  if (!file.path && typeof file.path !== 'string') {
    throw new TypeError('VoaFile: expect `file.path` to be string')
  }
  file.cwd = typeof file.cwd === 'string' ? file.cwd : process.cwd()
  file.type = typeof file.type === 'string' ? file.type : 'FileNode'
  file.children = utils.arrayify(file.children)
  utils.delegate(this, file)
}

module.exports = VoaFile
module.exports.VoaFile = VoaFile
