const Oss = require('../lib/oss')
const Request = require('../lib/request')

/**
 * { token, timeout }
 * @param {*} options 
 */
module.exports = function(options) {
  const token = options && options.token || 'YourGscToken';
  const timeout = options && options.timeout || 10000;
  const req = new Request({ token, timeout });
  const getRequest = req.getRequest.bind(req)
  return {
    oss: new Oss({ getRequest }),
  }
}