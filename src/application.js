const http = require('http')
const Router = require('./router')
const METHODS = require('./methods')
class Application {
  constructor() {
    this._router = new Router()
    this._initMethods()
  }

  _initMethods() {
    METHODS.forEach(method => {
      this[method] = function () {
        this._router[method].apply(this._router, arguments)
      }
    })
  }

  listen() {
    const server = http.createServer((req, res) => {
      if (!res.send) {
        res.send = function (body) {
          res.writeHead(200, {
            'Content-Type': 'text/plain',
          })
          res.end(body)
        }
      }

      if (!res.json) {
        res.json = function (json) {
          res.writeHead(200, {
            'Content-Type': 'application/json',
          })
          res.end(JSON.stringify(json))
        }
      }

      this._router.handle(req, res)
    })

    server.listen.apply(server, arguments)
  }
}

exports = module.exports = Application
