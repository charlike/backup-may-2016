// 'use strict'

var through2 = require('through2')
// var request = require('simple-get-stream')
var relike = require('relike')
var handleArguments = require('handle-arguments')
// var fs = require('fs')
// // var got = require('got')

function callback2stream (fn) {
  var self = this
  return function () {
    var argz = handleArguments(arguments)
    // console.log(arguments)
    if (argz.callback) {
      return fn.apply(self || this, arguments)
    }
    var stream = through2()
    relike.promisify(fn).apply(self || this, arguments).then(function (res) {
      stream.push(res)
    }, function (err) {
      stream.emit('error', err)
    })
    return stream
  }
}

var readFile = callback2stream(fs.readFile)

readFile('./beta.json', 'utf8', function (err, res) {
  console.log('err', err)
  console.log('res', res)
})

// var delegate = require('delegate-properties')
// var errorBase = require('error-base')
// var errorFmt = require('error-format')
// var extend = require('extend-shallow')
// var util = require('util')

// var UsefulError = errorBase('UsefulError', function (message, options) {
//   if (typeof message === 'object') {
//     options = message
//     message = false
//   }

//   var opts = extend({
//     showStack: true,
//     message: message && message.length && message || false
//   }, options)

//   opts.format = typeof opts.format === 'function' ? opts.format : defaultFormat
//   opts.message = typeof opts.message === 'function'
//     ? opts.message.call(this, opts)
//     : (typeof opts.message === 'string' ? opts.message : '')

//   delegate(this, opts)
//   errorFmt(this, opts.format)

//   if (this.showStack === false && hasOwn(this, 'stack')) {
//     delete this['stack']
//   }
// })

// /**
//  * > Default error `toString` method formatting.
//  *
//  * @param  {String} `headline`
//  * @return {String}
//  */

// function defaultFormat (headline) {
//   return util.format('%s (at %s:%s:%s)', headline, this.filename, this.line, this.column)
// }

// /**
//  * > Has own property util.
//  *
//  * @param  {OBject}  `self`
//  * @param  {String}  `key`
//  * @return {Boolean}
//  */

// function hasOwn (self, key) {
//   return Object.prototype.hasOwnProperty.call(self, key)
// }

// module.exports = UsefulError
