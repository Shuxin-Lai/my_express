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
        return this
      }
    })
  }

  handle(req, res) {
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

    var done = function finalhandler(err) {
      res.writeHead(404, {
        'Content-Type': 'text/plain',
      })

      if (err) {
        res.end('404: ' + err)
      } else {
        var msg = 'Cannot ' + req.method + ' ' + req.url
        res.end(msg)
      }
    }

    this._router.handle(req, res, done)
  }

  listen() {
    const server = http.createServer((req, res) => {
      this.handle(req, res)
    })

    server.listen.apply(server, arguments)
  }
}

exports = module.exports = Application
