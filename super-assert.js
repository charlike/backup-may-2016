'use strict'

var kindOf = require('kind-of-extra')
var regexpEqual = require('is-equal-regex')
var functionEqual = require('function-equal')
var isGenerator = require('is-es6-generator')

function sameValue (a, b) {
  if (a === b) {
    return a !== 0 || 1 / a === 1 / b
  }
  return a !== a && b !== b
}

function deepEqual (a, b) {
  if (arguments.length !== 2) {
    return false
  }
  if (a === false && b === false) {
    return true
  }
  if (a === true && b === true) {
    return true
  }
  if (a === null && b === null) {
    return true
  }
  if (a === undefined && b === undefined) {
    return true
  }

  var foo = kindOf(a)
  var bar = kindOf(b)

  if (foo !== bar) {
    return false
  }
  // var len = checks.length
  // var i = 0

  // while (i < len) {
  //   var check = checks[i++]
  //   if (foo === check.type) {
  //     return check.fn(a, b)
  //   }
  // }



  if (foo === 'number') {
    return sameValue(a, b)
  }
  if (foo === 'function' || foo === 'generatorfunction') {
    return functionEqual(a, b)
  }
  if (foo === 'date') {
    return dateEqual(a, b)
  }
  if (foo === 'regexp') {
    return regexpEqual(a, b)
  }
  if (foo === 'arguments') {
    return argumentsEqual(a, b)
  }
  if (foo === 'array') {
    return iterableEqual(a, b)
  }
  if (foo === 'object') {
    return objectEqual(a, b)
  }

  return sameValue(a, b)
}

var checks = [
  {type: 'number', fn: sameValue},
  {type: 'function', fn: functionEqual},
  {type: 'generatorfunction', fn: functionEqual},
  {type: 'date', fn: dateEqual},
  {type: 'regexp', fn: regexpEqual},
  {type: 'arguments', fn: argumentsEqual},
  {type: 'object', fn: iterableEqual},
  {type: 'array', fn: iterableEqual},
]

// strict-equal
// date-equal
// regexp-equal
// arguments-equal
// object-equal
// super-equal

function argumentsEqual (a, b) {
  a = [].slice.call(a)
  b = [].slice.call(b)
  return iterableEqual(a, b)
}

function dateEqual (a, b) {
  return sameValue(a.getTime(), b.getTime())
}

function iterableEqual (a, b) {
  if (a.length !==  b.length) return false
  var len = a.length
  var match = true
  var i = -1

  while (i++ < len) {
    if (!deepEqual(a[i], b[i])) {
      match = false
      break
    }
  }

  return match
}

function getProto (object) {
  if (typeof Object.getPrototypeOf === 'function') {
    return Object.getPrototypeOf(object)
  }
  if (''.__proto__ === String.prototype) {
    return object.__proto__
  }
  return object.constructor.prototype
}

function objectKeys (obj) {
  if (typeof Object.keys === 'function') {
    return Object.keys(obj)
  }
  var keys = []
  for (var key in obj) keys.push(key)
  return keys
}

function objectEqual (a, b) {
  if (getProto(a) !== getProto(b)) {
    return false
  }
  var ka = false
  var kb = false

  try {
    ka = objectKeys(a)
    kb = objectKeys(b)
  } catch (e) {
    return false
  }
  // having the same number of owned properties
  if (ka.length !== kb.length) {
    return false
  }
  ka.sort()
  kb.sort()

  var len = ka.length
  var match = true
  var i = -1

  while (i++ < len) {
    if (!deepEqual(a[ka[i]], b[kb[i]])) {
      match = false
      break
    }
  }
  return match
}


var fooErr = new TypeError('foo')
var num1 = new Number('123')
var str1 = new String('bar')
var num2 = Number('123')
var num3 = Object(42)
var str2 = String('bar')

var tests = [
  [-1, 1, false],
  [-1, +1, false],
  [1, 1, true],
  [-0, +0, false],
  [-0, 0, false],
  [+0, 0, true],
  [+0, +0, true],
  [-0, -0, true],
  [0, 0, true],
  [0, '0', false],
  [0, false, false],
  ['0', false, false],

  [NaN, NaN, true],

  [true, true, true],
  [false, false, true],
  [null, null, true],
  [undefined, undefined, true],

  [555, 555, true],
  [123, '123', false],

  [Infinity, Infinity, true],
  [Infinity, -Infinity, false],
  [-Infinity, -Infinity, true],
  [+Infinity, -Infinity, false],

  [false, '0', false],
  [false, '', false],
  [null, '', false],
  [true, '', false],
  [undefined, '', false],
  [undefined, '', false],

  [/regex/, /regex/, true],
  [/regex/g, /regex/, false],
  [/regex/g, /regex/mi, false],
  [/^regex$/, new RegExp('^regex$'), true],
  [/^regex$/gmi, new RegExp('^regex$'), false],

  [[{a: 'b'}, {c: 'd'}, 123], [{a: 'b'}, {c: 'd'}, 123], true],
  [[{a: 'b'}, {c: 'd'}, 123], [123, {a: 'b'}, {c: 'd'}], false],

  [[1, 2, 3], [1, 2, 3], true],
  [[1, 2, 3], [3, 2, 1], false],
  [[1, [2, 5, 6], 3], [1, [7, 8, 9], 3], false],
  [[1, [2, 5, 6], 3], [1, [2, 5, 6], 3], true],
  [[1, [2, 5, 6], 3], [3, [7, 8, 9], 1], false],

  [[1, {a: 'b'}, 3], [1, {a: 'b'}, 3], true],
  [[1, {a: {c: 'd'}}, 3, {e: 'f'}], [1, {a: {c: 'd'}}, 3, {e: 'f'}], true],
  [[1, {a: 'b'}, 3], [3, {a: 'b'}, 1], false],

  [{a: 1, b: 2}, {a: 1, b: 2}, true],
  [{a: 1, b: 2}, {b: 2, a: 1}, true],
  [{a: [1, 2, 3], b: {c: 456}}, {a: [1, 2, 3], b: {c: 789}}, false],

  [Promise.resolve(123), Promise.resolve(123), false],

  [new Function('return 123'), new Function('return 123'), true],
  [new Function('return 123')(), new Function('return 123')(), true],
  [new Function('return 456')(), new Function('return 567')(), false],

  [new Number('123'), new Number('123'), false],
  [new Number('123'), Number('123'), false],

  [new TypeError('foo'), new TypeError('foo'), false],

  [Object(42), Object(42), false],
  [num1, num1, true], // no diffs, they are really same thing
  [num2, num2, true], // no diffs, they are really same thing
  [num3, num3, true], // no diffs, they are really same thing
  [num1, num2, false],
  [fooErr, fooErr, true], // no diffs, they are really same thing

  [(a, b) => {}, (a, b) => {}, true],
  [(a, b) => {return a + b}, (a) => {return a + 123}, false],
  [(a, b) => a + b, (a) => a + 123, false],

  [function * genFn (a, b) {yield a; return a}, function * genFn (a, b) {yield a; return a}, true],
  [function * genFn (a, b) {yield a; return a + b}, function * genFn (a) {yield a; return a + 123}, false],

  // [(function * genFn (a, b) {yield a; return a})(), (function * genFn (a, b) {yield a; return a})(), false],
  // [(function * genFn (a, b) {yield a; return a + b})(), (function * genFn (a) {yield a; return a + 123})(), false],

  [function foo (a, b) {}, function foo (a, b) {}, true],
  [function foo (a, b) {return a + b}, function foo (a) {return a + 123}, false],

  ['str', 'str', true],
  ['str', String('str'), true],
  ['str', new String('str'), false],

  [str1, str1, true],
  [str2, str2, true],
  [str1, str2, false],
]

// @todo
// tests.push([fools, fools, true])

var util = require('util')
var eql = require('./deep-eql')
var isEqual = require('is-equal')

tests.forEach(function (val) {
  var res = deepEqual(val[0], val[1])
  // var res = deepEqual(val[0], val[1])
  console.log(res === val[2] ? 'ok' : 'not ok', util.inspect(val))
})

// console.log('actual')

// var parse = require('./parse-function')

// function functionEqual (a, b) {
//   if (typeof a !== 'function' && typeof b !== 'function') {
//     return false
//   }
//   var ra = parse(a)
//   var rb = parse(b)
//   return objectEqual(ra, rb)
// }

// console.log(objectEqual(function (a, b) {return 123}, function () {}))


// function generatorEqual (a, b) {
//   var res = false
//   while (!a.done && !b.done) {
//     var aValue = a.next()
//     var bValue = b.next()
//     if (aValue.done && bValue.done) {
//       res = aValue === bValue
//     } else {
//       a.done = aValue.done
//       b.done = bValue.done
//     }
//   }
//   return res
// }

// var gen1 = (function * genFn (a) {
//   yield a
//   return a
// })()
// var gen2 = (function * genFn (a, b) {
//   var val = a * b
//   yield val
//   return val
// })()
// var gen3 = (function * genFn (a) {
//   a = a + 123
//   yield a
//   return a
// })()

// console.log(generatorEqual(gen1, gen1))
