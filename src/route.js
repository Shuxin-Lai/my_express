const Layer = require('./layer')
const METHODS = require('./methods')

exports = module.exports = class Route {
  constructor(path) {
    this.path = path
    this.stack = []
    this.methods = {}

    this._initMethods()
  }

  _initMethods() {
    METHODS.forEach(method => {
      this[method] = fn => {
        const layer = new Layer('/', fn)
        layer.method = method
        this.methods[method] = true
        this.stack.push(layer)
        return this
      }
    })
  }

  handle_method(method) {
    const name = method.toLowerCase()
    return Boolean(this.methods[name])
  }

  dispatch(req, res) {
    const method = req.method.toLowerCase()

    for (let i = 0; i < this.stack.length; i++) {
      const layer = this.stack[i]
      if (layer.method === method) {
        return layer.handle_request(req, res)
      }
    }
  }
}
