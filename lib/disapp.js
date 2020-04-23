const { identity, get, set } = require('lodash/fp')
class DisApp {
  constructor({ getRequest }) {
    this.getRequest = getRequest
    this.prefix = '/disapp'
    this.shortLinkPrefix = 'https://www.gscapp.cn/app/'
  }
  async parse({ objectName }) {
    const { data } = await this.getRequest(`${this.prefix}/parse`, {
      objectName
    })
    return data
  }
  async list({ searchValue }) {
    const { data } = await this.getRequest(`${this.prefix}/list`, {
      page: 1,
      searchValue,
    })
    return get('list.0')(data)
  }
  /**
   * 获取到短连接
   */
  async shortLink() {
    const { data } = await this.getRequest(`${this.prefix}/shortlink/next`, {})
    return get('short_link')(data)
  }
  /**
   * 
   * @param {*} method create / update
   */
  async action({ action, record_id, template = 2, icon, name, disapp_id, shortLink }) {
    let newShortLink;
    if (action === 'create') {
      newShortLink = await this.shortLink();
    }
    const setShortLink = action === 'create' ? set('shortLink', newShortLink): identity;
    const { data } = await this.getRequest(`${this.prefix}/${action === 'update' ? 'version/update' : action }`, setShortLink({
      action,
      upload_id: record_id,
      disapp_id,
      template,
      icon,
      name
    }))
    return shortLink || `${this.shortLinkPrefix}${newShortLink}`
  }
}

module.exports = DisApp