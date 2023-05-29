const http = require('http')
const Router = require('./router')

const application = {
  _router: new Router(),
  get(path, handle) {
    this._router.get(path, handle)
  },
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
  },
}

exports = module.exports = application
