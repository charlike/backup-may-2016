/*!
 * compose-emitter <https://github.com/tunnckoCore/compose-emitter>
 *
 * Copyright (c) 2016 Charlike Mike Reagent <@tunnckoCore> (http://www.tunnckocore.tk)
 * Released under the MIT license.
 */

'use strict'

var sliced = require('sliced')
var extend = require('extend-shallow')
var AppBase = require('app-base').AppBase

function ComposeEmitter (options) {
  if (!(this instanceof ComposeEmitter)) {
    return new ComposeEmitter(options)
  }
  AppBase.call(this)
  this.options = options ? extend({listeners: {}}, options) : {listeners: {}}
}

AppBase.extend(ComposeEmitter)

ComposeEmitter.prototype.on = function on (name, fn, context) {
  context = context ? extend(this.options.context, context) : this.options.context
  this.options.context = context || this

  var listeners = this.options.listeners

  if (typeof name !== 'string') {
    throw new TypeError('.on expect `name` be string')
  }
  if (typeof fn !== 'function') {
    throw new TypeError('.on expect `fn` be function')
  }
  listeners[name] = hasOwn(listeners, name) ? listeners[name] : []
  listeners[name].push(fn)

  return this
}

ComposeEmitter.prototype.once = function once (name, fn, context) {
  context = context ? extend(this.options.context, context) : this.options.context
  this.options.context = context || this

  function handler () {
    this.off(name, handler)
    return fn.apply(this.options.context, arguments)
  }

  return this.on(name, handler.bind(this), this.options.context)
}

ComposeEmitter.prototype.off = function off (name, fn) {
  if (!arguments.length) {
    this.options.listeners = {}
    return this
  }
  if (typeof name !== 'string') {
    throw new TypeError('.on expect `name` be string')
  }
  if (arguments.length === 1) {
    this.options.listeners[name] = []
    return this
  }
  if (arguments.length > 1 && typeof fn !== 'function') {
    throw new TypeError('.on expect `fn` be function')
  }
  this.options.listeners[name].splice(this.options.listeners[name].indexOf(fn), 1)
  return this
}

ComposeEmitter.prototype.emit = function emit (name) {
  var listeners = this.options.listeners
  var context = this.options.context || this

  if (!arguments.length) {
    for (var type in listeners) {
      if (!hasOwn(listeners, type)) continue
      var len = listeners[type].length
      var i = 0

      while (i < len) {
        listeners[type][i++].call(context)
      }
    }
    return this
  }
  if (typeof name !== 'string') {
    throw new TypeError('.emit expect `name` be string')
  }
  if (arguments.length === 1) {
    if (!hasOwn(listeners, name)) return this
    var len = listeners[name].length
    var i = 0

    while (i < len) {
      listeners[name][i++].call(context)
    }
    return this
  }

  var args = sliced(arguments, 1)
  var len = listeners[name].length
  var i = 0

  while (i < len) {
    var fn = listeners[name][i++]
    fn.apply(context, args)
  }
  return this
}

function hasOwn (obj, key) {
  return Object.prototype.hasOwnProperty.call(obj, key)
}


module.exports = new ComposeEmitter()
module.exports.ComposeEmitter = ComposeEmitter
















function foo () {
  console.log('foo', this)
}
function bar () {
  console.log('bar', this)
}

var app = new ComposeEmitter({context: {a: 'b'}})
// app.once('foo', foo, {c: 'd'}).emit('foo').emit('foo') // => 'foo' once
// app.on('foo', foo).on('foo', foo).emit('foo') // => 'foo' twice
// app.on('foo', foo).off('foo', foo).emit('foo') // => nothing
// app.on('foo', foo).on('bar', bar).off().emit() // => nothing
// app.on('foo', foo).on('bar', bar).off('foo').emit() // => 'bar'
// app.on('foo', foo).on('bar', bar).off('foo').emit('foo') // => nothing
// app.on('foo', foo).on('bar', bar).off().emit('foo') // => returns this
// app.on('foo', foo).emit('abc') // returns this

  // .on('foo', function () {
  //   console.log('foo1')
  // })
  // .on('foo', function () {
  //   console.log('foo2')
  // })
  // .emit('foo')
  // .emit('foo')
