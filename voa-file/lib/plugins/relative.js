'use strict'

var path = require('path')
var utils = require('../utils')

module.exports = function relativePlugin (app) {
  return function (file) {
    utils.define(file, 'relative', {
      get: function () {
        return path.relative(this.cwd, this.path)
      },
      set: function () {
        throw new Error('VoaFile: cannot modify `file.relative` path')
      }
    })
  }
}
