/*!
 * fs-readdir <https://github.com/tunnckoCore/fs-readdir>
 *
 * Copyright (c) 2016 Charlike Mike Reagent <@tunnckoCore> (http://www.tunnckocore.tk)
 * Released under the MIT license.
 */

/* jshint asi:true */

'use strict'

// var test = require('assertit')
// var fsReaddir = require('./index')

// test('fs-readdir:', function () {
//   // body
// })

var File = require('vinyl')

var file = new File({
  path: 'foo/bar/qux.txt',
  type: 'text/plain'
})

console.log(file.cwd)
console.log(file.path)
console.log(file.relative)
console.log(file.basename)
console.log(file.dirname)
console.log(file.extname)
console.log(file.type)
