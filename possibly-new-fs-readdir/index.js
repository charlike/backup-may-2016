/*!
 * fs-readdir <https://github.com/tunnckoCore/fs-readdir>
 *
 * Copyright (c) 2016 Charlike Mike Reagent <@tunnckoCore> (http://www.tunnckocore.tk)
 * Released under the MIT license.
 */

'use strict'

var fs = require('graceful-fs')
var mm = require('micromatch')
var path = require('path')
var ctrl = require('async')
var isObject = require('isobject')
var parseGitignore = require('parse-gitignore')
var extend = require('extend-shallow')
var list = []

function arrayify (val) {
  if (!val) return []
  if (Array.isArray(val)) return val
  return [val]
}

function gitignore (options, callback) {
  var fp = path.join(options.cwd, '.gitignore')
  fs.readFile(fp, 'utf8', function (err, str) {
    if (err) return callback(err)
    var gitignored = parseGitignore.parse(str.split(/\r\n?|\n/), options)
    options.ignore = arrayify(options.ignore).concat(gitignored)
    callback(null, options)
  })
}

function fsReaddir (dir, patterns, options, callback) {
  if (typeof options === 'function') {
    return fsReaddir(dir, patterns, null, options)
  }
  if (typeof patterns === 'function') {
    return fsReaddir(dir, null, null, patterns)
  }
  if (typeof callback !== 'function') {
    throw new TypeError('fs-readdir: expect `callback` be function')
  }
  if (isObject(patterns)) {
    options = patterns
    patterns = null
  }
  patterns = patterns || ['*']
  options = extend({
    cwd: process.cwd(),
    gitignore: false,
    nodupes: true,
    recursive: false
  }, options)
  options.patterns = arrayify(patterns).concat(arrayify(options.patterns))
  options.ignore = arrayify(options.ignore)
  dir = path.resolve(options.cwd, dir)

  options.patterns = options.patterns.map(function (fp) {
    return path.resolve(dir, fp)
  })
  options.patterns.push(dir)
  options.ignore = options.ignore.map(function (fp) {
    return path.resolve(dir, fp)
  })
  readdir(dir, options, callback)
}

function readdir (basedir, opts, cb) {
  fs.readdir(basedir, function (err, filepaths) {
    if (err) return cb(err)
    var pending = filepaths.length
    if (!pending) return cb(null, list)

    ctrl.each(filepaths, function (fp, next) {
      fp = path.join(basedir, fp)

      fs.stat(fp, function (err, stat) {
        if (err) return next(err)
        if (mm(fp, opts.patterns, opts).length) list.push(fp)
        if (stat.isDirectory()) {
          readdir(fp, opts, function (err, names) {
            if (err) return next(err)
            var res = mm(names, opts.patterns, opts)
            list = res.length ? list.concat(res) : list
            if (!--pending) return cb(null, list)
            next()
          })
          return
        }
            if (!--pending) return cb(null, list)
        next()
      })
    }, function (err) {
      if (err) return cb(err)
      cb(null, list)
    })
  })
}

// module.exports = fsReaddir

// var glob = require('glob')
// glob('./**/*.js', {cwd: __dirname, dot: true}, function (err, res) {
//   console.log(err, res, res.length)
// })
fsReaddir('.', '**/*.js', {cwd: __dirname, dot: true}, function (err, res) {
  var unique = require('array-unique')
  console.log(err, res, res.length, unique(res).length)
})

// var isMatch = mm('**/*.md')
// var res = isMatch('/home/charlike/dev/globbing/new-fs-readdir/node_modules/filename-regex.md')
// console.log(res)
