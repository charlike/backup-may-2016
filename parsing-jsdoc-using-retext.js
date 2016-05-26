'use strict'

var extend = require('extend-shallow')

var u = require('unist-builder')
var visit = require('unist-util-visit')
var select = require('unist-util-select')
var remove = require('unist-util-remove')
var filter = require('unist-util-filter')
var inspect = require('unist-util-inspect')
var after = require('unist-util-find-after')
var codeBlocks = require('gfm-code-blocks')

visit.children = function visitChildren (parent, callback) {
  var index = -1;
  var children = parent && parent.children

  if (!children) {
    throw new Error('Missing children in `parent` for `visitor`');
  }

  while (++index in children) {
    callback(children[index], index, parent)
  }
}

var fs = require('fs')
var inputRaw = fs.readFileSync('./comment-raw.txt', 'utf8')
var input = fs.readFileSync('./comment.txt', 'utf8')

var rootNode = {
  type: 'RootNode',
  children: []
}

var retext = require('retext')
var app = retext
  .use(function (app) {
    var nexts = []
    var prevs = []

    app.prev = function prev (pos, i, parent) {
      if (arguments.length === 2) {
        parent = i
        i = pos
        pos = 1
      }
      if (!parent) return {}
      return parent.children[i - pos] ? parent.children[i - pos] : {}
    }
    app.next = function next (pos, i, parent) {
      if (arguments.length === 2) {
        parent = i
        i = pos
        pos = 1
      }
      if (!parent) return {}
      return parent.children[i + pos] ? parent.children[i + pos] : {}
    }
    app.getByType = function getByType (node, type) {
      if (!node.children) return null
      var res = null
      var len = node.children.length
      var i = 0

      while (i < len) {
        var children = node.children[i++]
        if (children.type === type) {
          res = children
          break
        }
      }

      return res
    }
    app.getAlways = function getAlways (node, type, value) {
      var TypeNode = app.getByType(node, type)
      if (!TypeNode) {
        app.setNode(u(type, value))
        TypeNode = app.getByType(node, type)
      }
      return TypeNode
    }
    app.removeByType = function removeByType (node, type) {
      node = remove(node, function (n) {
        return n.type === type
      })
    }
    app.getValue = function getValue (node, pos) {
      pos = pos || 0
      return node.value || node.children && node.children[pos].value || ''
    }
    app.setNode = function setNode (node) {
      rootNode.children.push(node)
    }
    app.sentence = function sentenceNode (node, name) {
      var value = ''
      visit(node, function (node) { if (node.value) value += node.value })
      return u(name || 'TextNode', {value: value, position: node.position})
    }
  })
  .use(function (app) {
    return function (ast) {
      rootNode.position = ast.position
      visit.children(ast, function (node, i, parent) {
        var next = app.next(i, parent)

        if (node.type === 'ParagraphNode' && (next.type === 'WhiteSpaceNode' && next.value === '\n\n')) {
          var DescriptionNode = app.sentence(node, 'DescriptionNode')
          var gfm = codeBlocks(DescriptionNode.value)[0]

          if (gfm) {
            // var ExampleNode = app.getAlways(rootNode, 'ExamplesNode', [])
            // var Example = u('ExampleNode', {
            var ExampleNode = u('ExampleNode', {
              value: gfm.code,
              code: gfm.code,
              lang: gfm.lang,
              block: gfm.block,
              raw: gfm.block,
              position: DescriptionNode.position
            })
            app.setNode(ExampleNode)
            // ExampleNode.children.push(Example)
            return
          }
          if (DescriptionNode.value.indexOf('@example') === 0) return
          app.setNode(DescriptionNode)
          // var Description = app.getAlways(rootNode, 'DescriptionNode', {value: ''})
          // if (Description.value.length !== 0) {
          //   Description.value += '\n\n' + DescriptionNode.value
          //   Description.position.end = DescriptionNode.position.end
          //   return
          // }
          // Description.value = DescriptionNode.value
          // Description.position = DescriptionNode.position
          return
        }
        if (node.type === 'ParagraphNode') {
          var state = {
            open: false,
            close: false,
            node: {
              name: '',
              types: []
            }
          }
          var typeOpen = false
          var typeClose = false
          var TagNode = u('TagNode', {children: []})
          visit.children(node.children[0], function (node, i, parent) {
            var next = app.next(i, parent)
            var prev = app.prev(i, parent)

            if (node.value === '{') state.open = true
            if (state.open && node.type === 'WordNode') {
              if (next.type === '}') TagNode.children
            }
            if (node.value === '}') state.close = true
            if (node.type === 'WhiteSpaceNode' && node.value === '\n') {
              console.log(TagNode)
            }
            if (prev.type === 'SymbolNode' && node.type === 'WordNode' && next.type === 'WhiteSpaceNode') {
              TagNode.name = app.getValue(node)
              // var name = app.getValue(node)
              // state.node.name = name
              // state.node.type = name[0].toUpperCase() + name.slice(1) + 'Node'
              // app.setNode(state.node)
            }
            // console.log(node)
            // console.log('====')
          })
          // console.log(tag)
        }
      })
    }
  })
  .process(inputRaw)

visit.children(rootNode, function (node) {
  // console.log(node)
})

/**
 * @param {Function|Array} `fn` transform json with plugins
 */

// =>
// {
//   type: 'TagNode',
//   raw: '@param {Function|Array} `fn` transform json with plugins'
//   name: 'param',
//   types: 'Function|Array',
//   value: 'fn',
//   description: 'transform json with plugins',
//   children: [
//     {
//       type: 'NameNode',
//       value: 'param'
//     },
//     {
//       type: 'TypesNode',
//       children: [
//         { type: 'TextNode', value: 'Function' },
//         { type: 'TextNode', value: 'Array' }
//       ]
//     },
//     {
//       type: 'TextNode',
//       value: 'transform json with plugins'
//     }
//   ]
// }
