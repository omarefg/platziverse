'use strict'

const utils = require('platziverse-utils')
const db = require('./')
const debug = require('debug')('platziverse:db:setup')
const inquirer = require('inquirer')
const chalk = require('chalk')
const prompt = inquirer.createPromptModule()
const force = process.argv.filter(f => f === '--force')[0]
const logging = s => debug(s)
const handleFatalError = utils.request.handleFatalError
const config = utils.db.config(true, logging)


async function setup () {
  if (!force) {
    const answer = await prompt([
      {
        type: 'confirm',
        name: 'setup',
        message: `${chalk.yellow('Esto va a destruir la BBDD, ¿deseas continuar?')}`
      }
    ])
    if (!answer.setup) {
      return console.log(`${chalk.blue('Ah bueno. Menos mal. Bichito ;).')}`)
    }
    console.log(`${chalk.blue('Espero que sepas lo que haces...')}`)
  }
  await db(config).catch(handleFatalError)
  console.log('Success')
  process.exit(0)
};

setup()
