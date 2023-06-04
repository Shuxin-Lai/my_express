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

  dispatch(req, res, done) {
    const method = req.method.toLowerCase()
    let index = 0
    const stack = this.stack

    function next(err) {
      if (err && err == 'route') {
        return done()
      }
      if (err && err == 'router') {
        return done(err)
      }

      if (index >= stack.length) {
        return done(err)
      }

      const layer = stack[index++]
      if (layer.method !== method) {
        return next(err)
      }

      if (err) {
        // return done(err)
        layer.handle_error(err, req, res, next)
      } else {
        layer.handle_request(req, res, next)
      }
    }

    next()
  }
}
