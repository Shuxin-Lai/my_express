exports = module.exports = class Router {
  constructor() {
    this.stack = [
      {
        path: '*',
        method: '*',
        handle(req, res) {
          res.writeHead(404, {
            'Content-Type': 'text/plain',
          })
          res.end('404 Not Found')
        },
      },
    ]
  }

  get(path, handle) {
    this.stack.push({
      path,
      method: 'GET',
      handle,
    })
  }
  handle(req, res) {
    for (let i = 1; i < this.stack.length; i++) {
      const route = this.stack[i]
      if (
        (req.url === route.path || route.path === '*') &&
        (req.method === route.method || route.method === '*')
      ) {
        return route.handle(req, res)
      }
    }

    return this.stack[0].handle && this.stack[0].handle(req, res)
  }
}
