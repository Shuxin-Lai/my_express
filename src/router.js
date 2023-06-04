const Layer = require('./layer')
const METHODS = require('./methods')
const Route = require('./route')

exports = module.exports = class Router {
  constructor() {
    this.stack = [
      new Layer('*', (req, res) => {
        res.writeHead(404, {
          'Content-Type': 'text/plain',
        })
        res.end('404 Not Found')
      }),
    ]
    this._initMethods()
  }

  route(path) {
    const route = new Route(path)
    const layer = new Layer(path, (req, res) => {
      route.dispatch(req, res)
    })

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

  handle(req, res) {
    for (let i = 1; i < this.stack.length; i++) {
      const layer = this.stack[i]
      if (
        layer.match(req.url) &&
        layer.route &&
        layer.route.handle_method(req.method)
      ) {
        return layer.handle_request(req, res)
      }
    }

    return this.stack[0].handle_request(req, res)
  }
}
