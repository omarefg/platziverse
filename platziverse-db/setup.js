'use strict'

const db = require('./')
const debug = require('debug')('platziverse:db:setup')
const inquirer = require('inquirer')
const chalk = require('chalk')
const prompt = inquirer.createPromptModule()
const CONFIG = {
  database: process.env.DB_NAME || 'platziverse',
  username: process.env.DB_USER || 'platzi',
  password: process.env.DB_PASS || 'platzi',
  host: process.env.DB_HOST || 'localhost',
  dialect: 'postgres',
  logging: s => debug(s),
  setup: true
}

async function setup () {
  const answer = await prompt([
    {
      type: 'confirm',
      name: 'setup',
      message: `${chalk.yellow('Esto va a destruir la BBDD, ¿deseas continuar?')}`
    }
  ])
  if (!answer.setup) return console.log(`${chalk.blue('Ah bueno. Menos mal. Bichito ;).')}`)
  console.log(`${chalk.blue('Espero que sepas lo que haces...')}`)
  await db(CONFIG).catch(handleFatalError)
  console.log('Success')
  process.exit(0)
};

function handleFatalError (err) {
  console.log(`${chalk.red('Fatal Error!')} ${err.message}`)
  console.log(err.stack)
  process.exit(1)
};

setup()
