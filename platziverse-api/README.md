# platziverse-api

## `Endpoints Details`

| Path                   | Method           | Body                                                    | Description                                                                 |
| ---------------------- | ---------------- | ------------------------------------------------------- | --------------------------------------------------------------------------- |
|  /agents               |  get             |                                                         |  Returns all conected agentes                                               |
|  /agent/:uuid          |  get             |  uuid: uuid of the agent                                |  Returns all agents associated to a uuid                                    |
|  /metrics/:uuid        |  get             |  uuid: uuid of the agent                                |  Returns all metrics associated to an agent uuid                            |
|  /metrics/:uuid/:type  |  get             |  uuid: uuid of the agent <br/> type: type of the agent  |  Returns the last 20 metrics associated to an agent by its uuid and type    |