const tree = require('fs-tree-iterator')
const pump = require('pump')
const fs = require('fs')
const path = require('path')
const { EventEmitter } = require('events')

module.exports = run

function run (dir, drive, cb) {
  if (!dir) dir = '.'
  const ite = tree(dir)
  const progress = new EventEmitter()

  progress.current = null

  ite.next(function loop (err, node) {
    if (err) return cb(err)

    if (!node) return cb(null)
    if (!node.stat.isFile()) return ite.next(loop)

    progress.current = node.path
    progress.emit('update', node.path)

    pump(fs.createReadStream(node.path), drive.createWriteStream(path.relative(dir, node.path)), function (err) {
      if (err) return cb(err)
      ite.next(loop)
    })
  })

  return progress
}
