exports = module.exports = class Layer {
  constructor(path, fn) {
    this.path = path
    this.handle = fn
    this.name = fn.name || '<anonymous>'
    this.route = null
  }

  handle_request(req, res) {
    const fn = this.handle
    if (fn) {
      fn(req, res)
    }
  }

  match(path) {
    if (path === this.path || path === '*') {
      return true
    }
    return false
  }
}
