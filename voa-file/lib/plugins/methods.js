'use strict'

var utils = require('../utils')
var VoaFile = require('../VoaFile')

module.exports = function isPlugin (app) {
  return function (file) {
    utils.delegate(file, {
      isDotfile: function isDotfile () {
        return utils.isDotfile(this.path)
      },
      isDotdir: function isDotdir () {
        return utils.isDotdir(this.path)
      },
      isNull: function isNull () {
        return this.contents === null
      },
      isBuffer: function isBuffer () {
        return utils.isBuffer(this.contents)
      },
      isStream: function isStream () {
        return utils.isNodeStream(this.contents)
      },
      clone: function clone (omit) {
        var f = new VoaFile(require('shallow-clone')(this.toJSON()))
        app.run(f)
        return f
      },
      inspect: function inspect () {
        return '<VoaFile relative="' + this.relative + '">'
      },
      toJSON: function toJSON (omit) {
        var obj = utils.toJSON(this, omit)
        var keys = Object.keys(obj)
        var len = keys.length
        var i = 0
        var res = {}

        while (i < len) {
          var key = keys[i++]
          if (obj[key] && typeof obj[key] !== 'function') res[key] = obj[key]
        }
        return res
      },
      toString: function toString (encoding) {
        encoding = typeof encoding === 'object' ? encoding.encoding : encoding
        encoding = typeof encoding === 'string'
          ? encoding
          : this.encoding || app.options && app.options.encoding || 'utf-8'

        return this.isBuffer() ? this.contents.toString(encoding) : ''
      }
    })
  }
}
