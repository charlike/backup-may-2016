'use strict'

var path = require('path')
var utils = require('../utils')
var dirname = {
  get: function () {
    return path.dirname(this.path)
  },
  set: function (val) {
    if (typeof val !== 'string') {
      throw new TypeError('VoaFile: expect `file.dirname` be string')
    }
    this.path = path.join(val, this.basename)
  }
}

module.exports = function dirnamePlugin () {
  return function (file) {
    utils.define(file, 'directory', dirname) // @todo
    utils.define(file, 'dirname', dirname)
  }
}
