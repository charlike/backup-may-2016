/*!
 * foobar <https://github.com/tunnckoCore/foobar>
 *
 * Copyright (c) 2016 Charlike Mike Reagent <@tunnckoCore> (http://www.tunnckocore.tk)
 * Released under the MIT license.
 */

'use strict'

// var pkg = require('load-pkg').sync(process.cwd())
// var set = require('set-value')
// var write = require('write-json')

// set(pkg, 'precommit\\.silent', true)
// write.sync('./package.json', pkg)


// gitclone api Tucuruí
// github-create (or github-base at all)
// git-user-name
// git-username
// git-email
// github-config
// user-home
// pkg-store?
// load-pkg?
//
// first time run:
// get user home -> git configs and defaults -> create/hidden/app/folder ->
// gitclone repo in hidden/app/folder/:projectName ->
//
// app init -> prompts name, desc etc project stuff ->
// (streaming) copy hidden/app/folder/:projectName to cwd/:promptName(or :projectName if empty) ->
// transform with jstransformers (extenstion) when copying




// var Base = require('base')
// var argv = require('base-argv')
// var cli = require('base-cli')

// var app = new Base()

// app.use(argv()).use(cli())

// var args = app.argv(process.argv.slice(2))

// app.cli.process(args)
// console.log(app)

var UsefulError = require('../foo')

module.exports = function (val) {
  if (!val) {
    throw new UsefulError('missing val', {
      value: val,
      showStack: true
    })
  }
  return true
}
