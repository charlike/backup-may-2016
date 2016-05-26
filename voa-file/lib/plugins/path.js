'use strict'

var path = require('path')
var utils = require('../utils')
var absolute = {
  get: function () {
    return this._path
  },
  set: function (val) {
    if (typeof val !== 'string') {
      throw new TypeError('VoaFile: expect `file.path` be string')
    }
    this._path = path.resolve(this.cwd, val)
  }
}

module.exports = function pathPlugin (app) {
  return function (file) {
    utils.define(file, 'cwd', app.options && app.options.cwd || file.cwd)
    utils.define(file, '_path', path.resolve(file.cwd, file.path))
    utils.define(file, 'path', absolute)
    utils.define(file, 'absolute', absolute)
  }
}
