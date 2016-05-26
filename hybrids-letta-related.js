'use strict'

var fs = require('fs')
var vfs = require('vinyl-fs')
var letta = require('letta')
var sliced = require('sliced')
var through2 = require('through2')
// var lettaValue = require('letta-value')
var onStreamEnd = require('on-stream-end')
var isNodeStream = require('is-node-stream')
var streamExhaust = require('stream-exhaust')
var isChildProcess = require('is-child-process')

function lettaStreamOne (val) {
  letta.promise = lettaStream.promise
  if (isNodeStream(val) || isChildProcess(val)) {
    return letta(onStreamEnd, streamExhaust(val))
  }
  if (typeof val === 'function') {
    return letta.apply(this, arguments).then(function (res) {
      if (isNodeStream(res) || isChildProcess(res)) {
        return letta(onStreamEnd, streamExhaust(res))
      }
      return res
    })
  }
  return letta(function () {
    return val
  })
}

function lettaStream (val) {
  letta.promise = lettaStream.promise
  if (!isNodeStream(val) && !isChildProcess(val)) {
    return letta(function () {
      return val
    })
  }
  return letta(onStreamEnd, streamExhaust(val))
}

// function lettaValue (val) {
//   letta.promise = lettaValue.promise

// }

var read = fs.createReadStream('./github-base/package.json')
// var promise = lettaStream(function () {
//   return read
// })

// var stream = vfs.src('fdgdfgs')
//   .pipe(through2.obj(function (file, enc, cb) {
//     var data = file.contents.toString()
//     data += '=====wilderwein====='
//     file.contents = new Buffer(data)
//     cb(null, file)
//   }))
//   .pipe(through2.obj(function (file, enc, cb) {
//     var data = file.contents.toString()
//     data += '!=====second====='
//     file.contents = new Buffer(data)
//     cb(null, file)
//   }))

  // .pipe(through2.obj(function (file, enc, cb) {
  //   // console.log(file.contents.toString())
  //   cb()
  // }))
  // var promise = lettaStream(function () {
  //   return stream
  // })

var promise = lettaStream(123)
// var promise = letta(function () {
//   return read
// }).then(lettaStream)

promise.then(function (file) {
  console.log('success', file)
}, console.error)

// /**
//  * new `letta-value`
//  */

// function lettaValue (val) {
//   letta.promise = lettaValue.promise
//   if (val && typeof val.subscribe === 'function') {
//     if (val.value) {
//       return letta(function () {
//         return val.value
//       })
//     }
//     return letta(subscribe, val)
//   }
//   if (isTypeofError(val)) {
//     return letta(function () {
//       throw val
//     })
//   }
//   return lettaStream.apply(this, arguments)
// }

// /**
//  * Callback-style wrapper for `rx.subscribe`
//  */

// function subscribe (val, callback) {
//   val.subscribe(function noop () {}, callback, function onComplete () {
//     callback.apply(this, [null].concat(sliced(arguments)))
//   }.bind(this))
// }
