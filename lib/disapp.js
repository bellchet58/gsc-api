class DisApp {
  constructor({ getRequest }) {
    this.getRequest = getRequest
    this.prefix = '/disapp'
  }
  async parse({ objectName }) {
    const { data } = await this.getRequest(`${this.prefix}/parse`, {
      objectName
    })
    return data
  }
}

module.exports = DisApp