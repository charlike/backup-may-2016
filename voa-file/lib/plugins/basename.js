'use strict'

var path = require('path')
var utils = require('../utils')
var basename = {
  get: function () {
    return path.basename(this.path)
  },
  set: function (val) {
    if (typeof val !== 'string') {
      throw new TypeError('VoaFile: expect `file.basename` be string')
    }
    this.path = path.join(this.dirname, val)
  }
}

module.exports = function basenamePlugin () {
  return function (file) {
    utils.define(file, 'filename', {
      get: function () {
        return path.basename(this.path, this.extname)
      },
      set: function (val) {
        if (typeof val !== 'string') {
          throw new TypeError('VoaFile: expect `file.filename` be string')
        }
        if (path.extname(val).length !== 0) {
          throw new Error('VoaFile: expect `file.filename` be without extension')
        }
        this.path = path.join(this.dirname, val + this.extname)
      }
    })

    utils.define(file, 'basename', {
      get: function () {
        return path.basename(this.path)
      },
      set: function (val) {
        if (typeof val !== 'string') {
          throw new TypeError('VoaFile: expect `file.basename` be string')
        }
        this.path = path.join(this.dirname, val)
      }
    })
  }
}

