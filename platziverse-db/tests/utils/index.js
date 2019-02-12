module.exports = {
    extend: (obj, value) => {
        const clone = Object.assign({}, obj)
        return Object.assign(clone, value)
    }
}