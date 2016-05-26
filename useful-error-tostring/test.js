/*!
 * useful-error-tostring <https://github.com/tunnckoCore/useful-error-tostring>
 *
 * Copyright (c) 2016 Charlike Mike Reagent <@tunnckoCore> (http://www.tunnckocore.tk)
 * Released under the MIT license.
 */

/* jshint asi:true */

'use strict'

var test = require('assertit')
var toString = require('./index')

test('useful-error-tostring:', function () {
  var err = new TypeError('foo bar')
  toString(err)
  console.log(err.toString())
})
