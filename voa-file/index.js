/*!
 * voa <https://github.com/tunnckoCore/voa>
 *
 * Copyright (c) 2016 Charlike Mike Reagent <@tunnckoCore> (http://www.tunnckocore.tk)
 * Released under the MIT license.
 */

'use strict'

var path = require('path')
var VoaFile = require('./lib/VoaFile')
var utils = require('./lib/utils')
var plugin = require('./lib/plugins')

function Voa (options) {
  if (!(this instanceof Voa)) {
    return new Voa(options)
  }
  this.options = typeof options === 'object' ? options : {}
  utils.use(this)

  this
    .
    .use(plugin.path)
    .use(plugin.relative)
    .use(plugin.extname)
    .use(plugin.dirname)
    .use(plugin.basename)
    .use(plugin.methods)
    .use(plugin.report)
}

Voa.prototype.createFile = function createFile (file) {
  this.file = new VoaFile(file)
  this.run(this.file)
  return this.file
}

module.exports = new Voa()
module.exports.Voa = Voa
module.exports.VoaFile = VoaFile
