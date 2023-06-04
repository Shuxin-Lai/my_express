const Layer = require('./layer')
const METHODS = require('./methods')
const Route = require('./route')

exports = module.exports = class Router {
  constructor() {
    this.stack = [
      // new Layer('*', (req, res) => {
      //   res.writeHead(404, {
      //     'Content-Type': 'text/plain',
      //   })
      //   res.end('404 Not Found')
      // }),
    ]
    this._initMethods()
  }

  route(path) {
    const route = new Route(path)
    const layer = new Layer(path, route.dispatch.bind(route))

    layer.route = route
    this.stack.push(layer)

    return route
  }

  _initMethods() {
    METHODS.forEach(method => {
      this[method] = (path, handle) => {
        const route = this.route(path)
        route[method](handle)
        return this
      }
    })
  }

  handle(req, res, done) {
    const stack = this.stack
    let index = 0
    const method = req.method.toLowerCase()

    function next(err) {
      let layerError = err === 'route' ? null : err

      if (layerError === 'router') {
        return done(null)
      }

      if (index >= stack.length) {
        return done(layerError)
      }
      const layer = stack[index++]
      if (
        layer.match(req.url) &&
        layer.route &&
        layer.route.handle_method(method)
      ) {
        return layer.handle_request(req, res, next)
      } else {
        return next(layerError)
      }
    }

    next()
  }
}
