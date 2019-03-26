'use strict'

module.exports = {
  parsePayload: payload => {
    if (payload instanceof Buffer) {
      payload = payload.toString('utf8')
    }

    try {
      payload = JSON.parse(payload)
    } catch (err) {
      payload = null
    }
    return payload
  },
  pipe: (source, target) => {
    if (!source.emit || !target.emit) {
      throw TypeError('Please pass EventEmitters as arguments')
    }
    const emit = source._emit = source.emit

    source.emit = function () {
      emit.apply(source, arguments)
      target.emit.apply(target, arguments)
      return source
    }
  }
}
