const Oss = require('../lib/oss')
const DisApp = require('../lib/disapp')
const Request = require('../lib/request')
const { get } = require('lodash/fp')

/**
 * { token, timeout }
 * @param {*} options 
 */
module.exports = function(options) {
  const token = options && options.token || 'YourGscToken';
  const timeout = options && options.timeout || 10000;
  const req = new Request({ token, timeout });
  const getRequest = req.getRequest.bind(req);
  const oss = new Oss({ getRequest, client: req.client });
  const disapp = new DisApp({ getRequest });
  return {
    oss,
    disapp,
    upload: async (filePath, exactName) => {
      const signed = await oss.getSign({})
      const { record_id, name, icon } = await oss.doUpload({ ...signed, filePath })
      const packageExists = await disapp.list({ searchValue: exactName || name })
      let shortLink;
      // 若不存在则要发布
      if(!packageExists) {
        shortLink = await disapp.action({ icon , record_id, name , action: 'create' });
      }else {
        shortLink = await disapp.action({ icon, record_id, name, disapp_id: get('record_id')(packageExists), shortLink: get('short_link')(packageExists), action: 'update'});
      }
      return shortLink;
    }
  }
}