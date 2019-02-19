module.exports = {
  extend: (obj, values) => {
    return {
      ...obj,
      ...values
    }
  }
}
