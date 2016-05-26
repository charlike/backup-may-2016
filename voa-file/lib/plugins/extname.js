'use strict'

var utils = require('../utils')
var path = require('path')
var extname = {
  get: function () {
    return path.extname(this.path)
  },
  set: utils.renameExt
}

module.exports = function extnamePlugin () {
  return function (file) {
    utils.define(file, 'extension', {
      get: function () {
        return path.extname(this.path).slice(1)
      },
      set: function (val) {
        var self = this
        self = utils.renameExt.call(self, val, 'extension')
      }
    })
    utils.define(file, 'extname', extname)
  }
}

