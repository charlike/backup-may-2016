/*!
 * useful-error <https://github.com/tunnckoCore/useful-error>
 *
 * Copyright (c) 2016 Charlike Mike Reagent <@tunnckoCore> (http://www.tunnckocore.tk)
 * Released under the MIT license.
 */

/* jshint asi:true */

'use strict'

var test = require('assertit')
var UsefulError = require('./index')

// @todo write tests
test('useful-error:', function () {
  var err = new UsefulError('foo')
  console.log(err)
})

var util = require('util')

// @todo update `kind-error` with using `useful-error`
function KindError (message, options) {
  if (!(this instanceof KindError)) {
    return new KindError(message, options)
  }
  if (typeof message === 'object') {
    options = message
    message = false
  }
  var opts = extend({
    showStack: false,
    message: message,
    format: function fmt (headline) {

    }
  }, options)
  UsefulError.call(this, opts)
}

util.inherits(KindError, UsefulError)
