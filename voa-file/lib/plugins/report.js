'use strict'

var utils = require('../utils')

module.exports = function report (app) {
  return function (file) {
    utils.delegate(file, {
      messages: [],
      report: function report (message, opts) {
        opts = typeof opts === 'object' ? opts : {}
        opts.severity = (opts.fatal ||opts.severity === 2) ? 2 : 1
        opts.message = opts.message || message
        opts.line = opts.line || 1
        opts.column = opts.column || 1

        var errors = this.errorCount || 0
        var warnings = this.warningCount || 0

        errors =  opts.severity === 2 ? errors++ : errors
        warnings =  opts.severity === 1 ? warnings++ : warnings

        utils.define(file, 'filePath', file.path)
        utils.define(file, 'errorCount', errors)
        utils.define(file, 'warningCount', warnings)

        this.messages.push(opts)
        return this
      },
      warn: function warn (message, opts) {
        opts = typeof opts === 'object' ? opts : {}
        opts.severity = 1
        return this.report(message, opts)
      },
      fail: fail,
      fatal: fail
    })

    function fail (message, opts) {
      opts = typeof opts === 'object' ? opts : {}
      opts.severity = 2
      return this.report(message, opts)
    }
  }
}
