/*!
 * useful-error-tostring <https://github.com/tunnckoCore/useful-error-tostring>
 *
 * Copyright (c) 2016 Charlike Mike Reagent <@tunnckoCore> (http://www.tunnckocore.tk)
 * Released under the MIT license.
 */

'use strict'

var metadata = require('stacktrace-metadata')
var define = require('define-property')


/**
 * > Has own property util.
 *
 * @param  {Object} `self`
 * @param  {String} `key`
 * @return {Boolean}
 */
function hasOwn (self, key) {
  return Object.prototype.hasOwnProperty.call(self, key)
}

function usefulErrorTostring (err, fn) {
  err = err || this
  if (!isError(err)) {
    throw new TypeError('format-error-tostring: expect `err` to be error instance')
  }
  fn = typeof fn !== 'function' ? defaultFormat : fn

  define(metadata(err), 'toString', factory(fn))
}

function factory (format) {
  return function toString () {
    var defaultLine = this.message && this.message.length
      ? this.name + ': ' + this.message
      : this.name

    return format.call(this, defaultLine)
  }
}

function defaultFormat (headline, info) {
  // if (hasOwn(this, 'actual') && hasOwn(this, 'inspect') && hasOwn(this.inspect, 'actual')) {
  //   headline += '\n    actual: ' + this.inspect.actual
  // }
  // if (hasOwn(this, 'expected') && hasOwn(this, 'inspect') && hasOwn(this.inspect, 'expected')) {
  //   headline += '\n  expected: ' + this.inspect.expected
  // }
  return headline
}

// @todo update `is-typeof-error`
function isError (val) {
  return typeof val === 'object' &&
    val instanceof Error &&
    typeof val.message === 'string'
}

var failingLine = require('failing-line')
var KindError = require('kind-error')

// var err = new KindError({
//   actual: 123,
//   expected: 'qux'
// })

var err = new TypeError('f')
usefulErrorTostring(err)
// console.log(metadata(err))
console.log(err.toString())
console.log(actual)
