'use strict'

var templates = require('templates')
var app = templates()

app.create('docs', { viewType: 'partial' })

console.log(app)
