class OSS {
  constructor({ getRequest }) {
    this.getRequest = getRequest
    this.prefix = '/oss'
  }
  async getSign({ bucket = 'hiapp-package', dir = 'ipa' }) {
    const { data } = await this.getRequest(`${this.prefix}/getsign`, {
      bucket,
      dir
    })
    return data
  }
}

module.exports = OSS