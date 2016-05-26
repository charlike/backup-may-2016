'use strict'

/**
 * Module dependencies
 */

var path = require('path')
var utils = require('lazy-cache')(require)

/**
 * Temporarily re-assign `require` to trick browserify and
 * webpack into reconizing lazy dependencies.
 *
 * This tiny bit of ugliness has the huge dual advantage of
 * only loading modules that are actually called at some
 * point in the lifecycle of the application, whilst also
 * allowing browserify and webpack to find modules that
 * are depended on but never actually called.
 */

var fn = require
require = utils // eslint-disable-line no-undef, no-native-reassign

/**
 * Lazily required module dependencies
 */

require('define-property', 'define')
require('export-files')
require('extend-shallow')
require('is-buffer')
require('is-dotdir')
require('is-dotfile')
require('is-node-stream')
require('is-plain-object')
require('use')

/**
 * Restore `require`
 */

require = fn // eslint-disable-line no-undef, no-native-reassign

utils.renameExt = function renameExt (val, prop) {
  if (typeof val !== 'string') {
    prop = typeof prop === 'string' ? prop : 'extname'
    throw new TypeError('voa: expect `file.' + prop + '` be string')
  }
  val = val[0] === '.' ? val : '.' + val
  this.basename = path.basename(this.path, path.extname(this.path)) + val
  this.path = path.join(this.dirname, this.basename)
  return this
}

utils.delegate = function delegate (receiver, provider, omit) {
  var props = Object.getOwnPropertyNames(provider)
  var omits = utils.arrayify(omit).concat(['_path', 'fns'])
  var len = props.length
  var i = 0
  var res = []

  while (i < len) {
    var key = props[i++]
    if (omits[key] !== key) {
      utils.define(receiver, key, provider[key])
    }
  }
  return res
}

utils.toJSON = function toJSON (file, omit) {
  var props = Object.getOwnPropertyNames(file)
  var omits = utils.arrayify(omit).concat(['_path', 'fns'])
  var len = props.length
  var i = -1
  var res = {}

  while (i++ < len) {
    var key = props[i]
    if (omits.indexOf(key) === -1) {
      res[key] = file[key]
    }
  }
  return res
}

utils.arrayify = function arrayify (val) {
  if (!val) return []
  if (Array.isArray(val)) return val
  return [val]
}

utils.stringifyLocation = function stringifyLocation (loc) {
  loc = typeof loc !== 'object' ? {} : loc
  return (loc.line || 1) + ':' + (loc.column || 1)
}

// utils.

/**
 * Expose `utils` modules
 */

module.exports = utils
