exports = module.exports = class Layer {
  constructor(path, fn) {
    this.path = path
    this.handle = fn
    this.name = fn.name || '<anonymous>'
    this.route = null
  }

  handle_request(req, res, next) {
    const fn = this.handle
    try {
      fn(req, res, next)
    } catch (err) {
      next(err)
    }
  }

  handle_error(error, req, res, next) {
    const fn = this.handle
    if (fn.length !== 4) {
      return next(error)
    }
    try {
      fn(error, req, res, next)
    } catch (err) {
      next(err)
    }
  }

  match(path) {
    if (path === this.path || path === '*') {
      return true
    }
    return false
  }
}
