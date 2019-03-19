# platziverse-utils


## `Functions tree`

```js

utils 
│
└───request
│   │
│   │   handleFatalError(error)
│   │   handleError(error)
│
│   
└───db
│   │ 
│   │   config(setup, logging)
│
└───general
    │
    │   parsePayload(payload)
    │

```

## `Functions Details`

| Function           | Parameters       | Parameters Type     | Return        | Module    | Description                                   |
| :----------------: | :--------------: | :-----------------: | :-----------: | :-------: | :-------------------------------------------: |
|  handleFatalError  |  error           |  Error              |  Undefined    |  request  |  It handle fatal errors and stop process      |
|  handleError       |  error           |  Error              |  Undefined    |  request  |  It handle error without stopping process     |
|  config            |  setup / logging |  Boolean / Function |  Object       |  db       |  It return an object to config the database   |
|  parsePayload      |  payload         |  Buffer             |  Object       |  general  |  It return an object from a payload buffer    |

## `Use`

```js
const utils = require('platziverse-utils')

const { handleFatalError, handleError } = utils.request
const { config } = utils.db
const { parsePayload } = utils.general
const db = require('db')

//So we are defining an error first callback
function callback (err, res) {
    if (err) {
        return handleError(err) // It returned an error and the process don't need to stop
    }
    return parsePayload(res.buffer) // It did not returned an error so now you can parse the response
}

//In this example db is an async function that starts a db instance and it receive a config object as parameter
async function startDB (config) {
    // Start db, but if it return an error handle it and stop process
    await db(config).catch(err => handleFatalError)
}

// Start db passing it the config object we required
startDB(config)


```