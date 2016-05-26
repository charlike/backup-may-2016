'use strict'




/*

  ctrl.mapSeries([
    function (foo, num, done) {
      test.strictEqual(foo, 'foo')
      test.strictEqual(num, 123)
      test.deepEqual(this, {a: 'b'})
      this.one = 111
      done(null, this.one + num + foo)
      // return function (foo, num) {
      //   test.strictEqual(foo, 'foo')
      //   test.strictEqual(num, 123)
      //   test.deepEqual(this, { a: 'b', one: 111 })
      //   this.two = 222

      //   return function (str, num, next) {
      //     test.strictEqual(str, 'foo')
      //     test.strictEqual(num, 123)
      //     test.deepEqual(this, { a: 'b', one: 111, two: 222 })
      //     this.a = str

      //     next(null, {first: str, second: this.two + num})
      //   }
      // }
    },
    function (str) {
      // test.deepEqual(this, { a: 'foo', one: 111, two: 222 })
      this.three = 333
      return this.three
      // return function (a, num) {
      //   test.deepEqual(this, { a: str, one: 111, two: 222, three: 333 })
      //   return this.three + num + str
      // }
    }
  ], iterator, function (err, res) {
    // test.ifError(err)
    console.log('end', err, res)
    test.strictEqual(1, 2, 'should throw')
    // test.deepEqual(res, [{basr: 'qux'}, 3])
    console.log('ok')
    console.log('ok err', err)
    console.log('ok res', res)
    done()
  })

 */















// var Schema = require('map-schema')
// var sliced = require('sliced')
// var isArray = require('isarray')
// var isArgs = require('is-arguments')
// var util = require('util')

// var numbersMap = {
//   0: 'first',
//   1: 'second',
//   2: 'third',
//   3: 'fourth',
//   4: 'fifth',
//   5: 'sixth',
//   6: 'seventh',
//   7: 'eighth',
//   8: 'ninth',
//   9: 'tenth'
// }

// function MapArguments (options) {
//   if (!(this instanceof MapArguments)) {
//     return new MapArguments(options)
//   }
//   Schema.call(this, options)
//   this.data = {}
// }
// util.inherits(MapArguments, Schema)

// MapArguments.prototype.args = function args () {
//   var args = sliced(arguments)
//   args = isArgs(args[0]) ? sliced(args[0]) : args

//   for (var i in numbersMap) {
//     var key = numbersMap[i]
//     this.data[key] = args[i]
//   }

//   return this
// }

// MapArguments.prototype.first = function first () {
//   return this.field.apply(this, ['first'].concat(sliced(arguments)))
// }
// MapArguments.prototype.second = function second () {
//   return this.field.apply(this, ['second'].concat(sliced(arguments)))
// }
// MapArguments.prototype.third = function third () {
//   return this.field.apply(this, ['third'].concat(sliced(arguments)))
// }
// MapArguments.prototype.fourth = function fourth () {
//   return this.field.apply(this, ['fourth'].concat(sliced(arguments)))
// }
// MapArguments.prototype.fifth = function fifth () {
//   return this.field.apply(this, ['fifth'].concat(sliced(arguments)))
// }
// MapArguments.prototype.sixth = function sixth () {
//   return this.field.apply(this, ['sixth'].concat(sliced(arguments)))
// }
// MapArguments.prototype.param = function param () {
//   return this.field.apply(this, arguments)
// }

// var map = new MapArguments()

// function one (a, b, c) {
//   map.args(arguments)
//     .first('number', {
//       validate: function (val) {
//         return val === 123;
//       },
//       default: 'qux'
//     })
//     .field('second', ['object', 'string'], {
//       normalize: function(val) {
//         return typeof val === 'object' ? val.url : val;
//       }
//     })
//     .third('function', {required: true})
//     .normalize(map.data)
//   return map
// }
// var m = one([1, 'foo'], {url: 'data.bg'})

// console.log(m)

var set = require('set-value')
var get = require('get-value')
var test = require('assertit')
var assert = require('assertit')
var isObject = require('is-extendable')

function validate (schema) {
  var msg = 'object-validate-schema: `schema` should be an object'
  assert.strictEqual(isObject(schema), true, msg)

  return function validateData (data) {
    msg = 'object-validate-schema: `data` should be an object'
    assert.strictEqual(isObject(data), true, msg)

    var res = {}

    Object.keys(schema).forEach(function (key) {
      set(res, key, schema[key](get(data, key)))
    })

    return res
  }
}

// assert.deepStrictEqual = require('is-equal-shallow')

/**
 * Test.
 */

test('validate', function() {
  // test('should validate input (lol, how meta)', function() {
  //   assert.throws(function _fixture() {
  //     validate('foo')
  //   }, /`schema` should be an object/)
  // })

  // test('should return a function', function() {
  //   assert(typeof validate({}), 'function')
  // })

  // test('the returned function should validate input types', function() {
  //   assert.throws(function _fixture() {
  //     validate({})('foo')
  //   }, /`data` should be an object/)
  // })

  test('should validate objects', function() {
    var schema = validate({
      name: function(val) { return typeof val === 'string' },
      age: function(val) { return typeof val === 'number' },
    })

    var res = schema({
      name: 'foo',
      age: 'bar'
    })

    assert.deepStrictEqual(res, { name: true, age: false })
  })

  test('should validate objects when validator class given', function() {
    function Validator() {}
    Validator.prototype.name = function(val) { return typeof val === 'string' }
    Validator.prototype.age = function(val) { return typeof val === 'number' }

    var schema = validate(new Validator())

    var res = schema({
      name: 'foo',
      age: 'bar'
    })

    assert.deepStrictEqual(res, { name: true, age: false })
  })

  test('should validate given class', function() {
    function Klass() {}
    Klass.prototype.name = 'foo'
    Klass.prototype.age = 'bar'

    var schema = validate({
      name: function(val) { return typeof val === 'string' },
      age: function(val) { return typeof val === 'number' },
    })

    var res = schema(new Klass())

    assert.deepStrictEqual(res, { name: true, age: false })
  })

  test('should validate class with validator class', function() {
    function Klass() {}
    Klass.prototype.name = 'foo'
    Klass.prototype.age = 'bar'

    function Validator() {}
    Validator.prototype.name = function(val) { return typeof val === 'string' }
    Validator.prototype.age = function(val) { return typeof val === 'number' }

    var schema = validate(new Validator())
    var res = schema(new Klass())

    assert.deepStrictEqual(res, { name: true, age: false })
  })

  test('should validate objects with dots defined schema like `user.name`', function() {
    var schema = validate({
      'user.name': function(val) { return typeof val === 'string' },
      'user.age': function(val) { return typeof val === 'number' },
    })

    var res = schema({
      user: {
        name: 'foo',
        age: 'bar'
      }
    })

    assert.deepStrictEqual(res, { user: { name: true, age: false } })
  })
})
