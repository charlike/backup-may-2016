'use strict'

// @todo not use kindof
var kindOf = require('kind-of')
var isArray = require('isarray')
var isArguments = require('is-arguments')
var objectKeys = require('object-keys')

/**
 * > Deep strict equality! Iterate over object, array or Arguments object.
 *
 * @param  {Array|Object|Arguments} `a`
 * @param  {Array|Object|Arguments} `b`
 * @return {Boolean}
 * @api public
 */

function iterableEqual (a, b) {
  if (!isAllowed(a, b)) {
    return false
  }
  if (isArguments(a) && isArguments(b)) {
    a = [].slice.call(a)
    b = [].slice.call(b)
  }
  if (getProto(a) !== getProto(b)) {
    return false
  }

  var keysA = objectKeys(a)
  var keysB = objectKeys(b)

  if (keysA.length !== keysB.length) {
    return false
  }

  keysA.sort()
  keysB.sort()

  var ret = false
  var len = keysA.length
  var i = -1

  while (i++ < len) {
    var keyA = keysA[i]
    var keyB = keysB[i]

    if (keyA !== keyB) {
      ret = false
      break
    }

    var valA = a[keyA]
    var valB = b[keyB]

    if (!isAllowed(valA, valB)) {
      ret = valA === valB
    } else {
      if (isArguments(valA) && isArguments(valB)) {
        valA = [].slice.call(valA)
        valB = [].slice.call(valB)
      }
      // array / object
      ret = iterableEqual(valA, valB)
    }
    if (ret === false) break
  }

  return ret
}

/**
 * > Is allowed type for iteration - array, object, arguments.
 *
 * @param  {Array|Object|Arguments} `a`
 * @param  {Array|Object|Arguments} `b`
 * @return {Boolean}
 */

function isAllowed (a, b) {
  if (!a || !b) return false
  if (isArray(a) && isArray(b)) return true
  if (isArguments(a) && isArguments(b)) return true
  return kindOf(a) === 'object' && kindOf(b) === 'object'
}

/**
 * > Get prototype, cross-browser compatible to IE6?
 *
 * @param  {Object} `obj`
 * @return {Object}
 */

function getProto (obj) {
  if (typeof Object.getPrototypeOf === 'function') {
    return Object.getPrototypeOf(obj)
  }
  if (typeof 'test'.__proto__ === 'object') {
    return obj.__proto__
  }
  var ctor = obj.constructor
  if (has(obj, 'constructor')) {
    var oldCtor = ctor
    if (!(delete obj.constructor)) { // reset constructor
      return null // can't delete obj.constructor, return null
    }
    ctor = obj.constructor // get real constructor
    obj.constructor = oldCtor // restore constructor
  }
  return ctor ? ctor.prototype : Object.prototype // needed for IE
}

/**
 * > Has own property util.
 *
 * @param  {Object}  `self`
 * @param  {String}  `key`
 * @return {Boolean}
 */

function hasOwn (self, key) {
  return Object.prototype.hasOwnProperty.call(self, key)
}

/**
 * TESTS / EXAMPLES
 */

var emptyObject = {}
var obj1 = {
  a: 1,
  b: [2, 4],
  c: {
    d: 4
  }
}
var obj2 = {
  a: 1,
  b: [2, 4],
  c: {
    d: 3
  }
}
var obj3 = {
  a: 1,
  b: 2,
  c: {
    d: 'foo'
  }
}
var nestedObject = {
  foo: obj1,
  bar: {
    baz: obj1,
    qux: obj1
  }
}
// nestedObject.abc = nestedObject

var diffKeys1 = {
  foo: 'bar'
}
var diffKeys2 = {
  'foo': 'bar'
}


/**
 * ARRAYS
 */

var arr1 = [
  1, 2, 3
]
var arr2 = [
  123, 456
]
var arr3 = [
  1, 2, [3, 4, 5]
]
var arr4 = [
  1, 2, [3, 45, 6]
]
var arr5 = [
  1, 2, {a: 'b'}, 3, [4, 5]
]
var arr8 = [
  1, 2, {a: 'b'}, 3, [4, 5]
]
var arr6 = [
  1, 2, {a: {b: 'cde'}}, 3, [4, 5], [{foo: 'bar'}, 6, {baz: 'qux'}]
]
var arr7 = [
  1, 2, {a: {b: 'cde'}}, 3, [4, 5], [{foo: 'bar'}, 6, {baz: 'qux'}]
]

function Foo () {
  this.bar = 'qux'
}
Foo.prototype.baz = 'hello'

function Data () {
  this.bar = 'qux'
}
Data.prototype.baz = 'hello'

var bool = new Boolean(true)
var num = new Number(123)

function args () {
  return arguments
}

var aro = {
  a: args(1, 2, 3),
  b: {
    c: args(5, 6)
  }
}
var aro2 = {
  a: args(1, 2, 3),
  b: 123
}
var aro3 = [{
  a: [1, args(2), 3]
}, 4, 5, args(6, 7), 'str']
var aro4 = [{
  a: [1, 2, args(2), 3]
}, 4, 5, args(6, 7), 'foo']

// console.log(iterableEqual(Foo.prototype, Data.prototype))
// console.log(iterableEqual(obj1, obj2))
// console.log(iterableEqual(aro3, aro4))
