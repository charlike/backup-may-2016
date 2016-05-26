'use strict'

var fs = require('fs')
// var vfs = require('vinyl-fs')
var letta = require('./letta')
// var sliced = require('sliced')
// var through2 = require('through2')
// var onStreamEnd = require('on-stream-end')
var thenCallback = require('then-callback')
// var isNodeStream = require('is-node-stream')
// var streamExhaust = require('stream-exhaust')
// var readAllStream = require('read-all-stream')
// var isChildProcess = require('is-child-process')
var handleArguments = require('handle-arguments')

// // letta(function () {
// //   return fs.createReadStream('./foo.js')
// // })
// // .then(lettaStreamRead)
// // .then(function (res) {
// //   console.log('end', res)
// // }, console.error)


// // @package `letta-stream`
// function lettaStream (val) {
//   letta.promise = lettaStream.promise
//   if (!isNodeStream(val) && !isChildProcess(val)) {
//     return letta(function () {
//       return val
//     })
//   }
//   return letta(onStreamEnd, streamExhaust(val))
// }

// // @package `letta-stream-read`
// function lettaStreamRead (val, opts) {
//   letta.promise = lettaStreamRead.promise
//   if (!isNodeStream(val) && !isChildProcess(val)) {
//     return letta(function () {
//       return val
//     })
//   }
//   return readAllStream(val, opts)
// }

// @package `hybridify`
function hybridify () {
  var argz = handleArguments(arguments)
  return thenCallback(letta.apply(this, argz.args)).then(argz.callback)
}

hybridify(fs.readFile, './foo.js', function (err, res) {
  console.log('callback err:', err)
  console.log('callback res:', res)
})
// .then(function (res) {
//   console.log('promise res:', res)
// }, function (err) {
//   console.log('promise err:', err)
// })

