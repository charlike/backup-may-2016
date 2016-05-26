/*!
 * voa <https://github.com/tunnckoCore/voa>
 *
 * Copyright (c) 2016 Charlike Mike Reagent <@tunnckoCore> (http://www.tunnckocore.tk)
 * Released under the MIT license.
 */

/* jshint asi:true */

'use strict'

var test = require('assertit')
var voa = require('./index')
// var Voa = require('./index').Voa

test('voa:', function () {
  var reporter = require('eslint-formatter-pretty')
  voa
    .use(function (app) {
      return function (file) {
        if (file.filename === 'qux') {
          file.filename = 'zzz'
          file.extension = 'js'
        }
      }
    })
    .use(function (app) {
      return function (file) {
      }
    })


  var file = voa.createFile('foo/bar/main.js')
  file.children.push(voa.createFile('bar/charlike.js'))

  var one = file.clone()
  var two = file.clone()
  var foo = file.clone()

  one.basename = '11.txt'
  two.basename = '22.css'

  foo.filename = 'zoo'
  foo.extension = 'gz'

  file.filename = 'file'
  file.children.push(one)
  // console.log(file.toJSON())
  file.children.push(two)
  file.children.push(foo)
  // console.log(file.toJSON())
  console.log(file.children[1].toJSON())

  // console.log(file.toJSON())

  var visit = require('unist-util-visit')



  // console.log(file.children[0].basename) // => one-qux.bat
  // console.log(file.children[1].basename) // => two-qux.bat
  // console.log(file.children[2].basename) // => foo-qux.bat

  // file.warn('AVA should be imported as `test`.', {line: 66, column: 39})
  // file.fatal('Unexpected comment man.', {line: 34, column: 4})
  // file.warn('Charlike `bold` yeah.', {line: 12, column: 25})
  // console.log(file.messages)
  // var output = reporter([file])

  // console.log(file.path)
  // console.log(file.clone().path)
  // console.log(file.path)
  // file.extname = '.css'
  // console.log(file.path)
  // console.log(voa.clone().path)
  // console.log(file.path)
  // file.extname = '.gz'
  // console.log(file.path)
})
