#!/usr/bin/env node

'use strict'

/* eslint new-cap: "off" */

// const minimist = require('minimist')
// const args = minimist(process.argv)

// console.log('hello platziverse')
// console.log(args)

// const args = require('args')

// args
//   .option('port', 'The port on which the app will be running', 3000)
//   .option('reload', 'Enable/disable livereloading')
//   .command('serve', 'Serve your static site', ['s'])

// const flags = args.parse(process.argv)

const blessed = require('blessed')
const contrib = require('blessed-contrib')

const screen = blessed.screen()

const grid = new contrib.grid({
  rows: 1,
  cols: 4,
  screen
})

const tree = grid.set(0, 0, 1, 1, contrib.tree, {
  label: 'Connected Agents'
})

const line = grid.set(0, 1, 1, 3, contrib.line, {
  label: 'Metric',
  legend: true,
  minY: 0,
  xPadding: 5
})

screen.key(['escape', 'q', 'C-c'], (char, key) => {
  process.exit(0)
})

screen.render()
