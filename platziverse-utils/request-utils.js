'use strict'

const chalk = require('chalk')

module.exports = {
  handleFatalError: error => {
    console.log(`${chalk.red('[Fatal Error!]')} ${error.message}`)
    console.log(error.stack)
    process.exit(1)
  },
  handleError: error => {
    console.log(`${chalk.red('[Error!]')} ${error.message}`)
    console.log(error.stack)
  }
}
