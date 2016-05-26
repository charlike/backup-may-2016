/*!
 * foobar <https://github.com/tunnckoCore/foobar>
 *
 * Copyright (c) 2016 Charlike Mike Reagent <@tunnckoCore> (http://www.tunnckocore.tk)
 * Released under the MIT license.
 */

/* jshint asi:true */

'use strict'

var foo = require('./index')

try {
  foo(false)
} catch (err) {
  console.log(err)
  console.log(err.toString())
}

// var fs = require('fs')
// var abc = [1, 2, 3]

// .ok(value, [message]) / .truthy
// Assert that value is truthy.

// .notOk(value, [message]) / .falsey
// Assert that value is falsy.

// .true(value, [message])
// Assert that value is true.

// .false(value, [message])
// Assert that value is false.

// .is(value, expected, [message]) - not strict / (.equal - strict?) / (.strictEqual - maybe as .same fallback)
// Assert that value is (strict) equal to expected.

// .not(value, expected, [message]) - not strict / (.notEqual - strict?) / (.notStrictEqual - maybe as .notSame fallback)
// Assert that value is not (strict) equal to expected.

// .same(value, expected, [message]) / .deepEqual / .deep
// Assert that value is deep equal to expected.

// .notSame(value, expected, [message]) / .notDeepEqual / .notDeep
// Assert that value is not deep equal to expected.

// .ifError(value, [message])
// Assert that value is error.


// mukla('package-name header')
// .parallel(function () {
//   return this
//     .equal('fs.readFile should be function', typeof fs.readFile, 'function')
//     .true('not have body property', isEmptyFunction('(a) => {}'))
//     .same('abc should be [1, 2, 3]', abc, [1, 2, 3])
//     .true('fs.readFile should be function', Array.isArray([1, 2]))
//     .it('should have some test title', function (cb) {
//       mukla.plan(3)
//       fs.readFile('./package.json', function (err, res) {
//         mukla.ifError(err)
//         mukla.equal(typeof res, 'function')
//         mukla.equal(JSON.parse(res).name, 'mukla')
//         cb() // or mukla.end()
//       })
//     })
//     .series(function () {
//       return this
//         .true('not have body property', isEmptyFunction('(a) => {}'))
//         .same('abc should be [1, 2, 3]', abc, [1, 2, 3])
//         .equal('fs.readFile should be function', typeof fs.readFile, 'function')
//     })
// })
// .on('pass', function (title, info) {
//   console.log('ok:', title, info)
// })
