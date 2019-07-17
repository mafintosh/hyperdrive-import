#!/usr/bin/env node

const imp = require('./')
const hyperdrive = require('hyperdrive')

if (process.argv.length < 4) {
  console.error('Usage: hyperdrive-import <src> <dest>')
  process.exit(1)
}

const src = process.argv[2]
const drive = hyperdrive(process.argv[3])

imp(src, drive, function (err) {
  if (err) throw err
}).on('update', function () {
  console.log('Importing ' + this.path, '(' + this.stat.size + ' bytes)')
})
