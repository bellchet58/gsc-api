class App {
  constructor({ getRequest }) {
    this.getRequest = getRequest
    this.prefix = '/app'
  }
  async info({ id }) {
    const { data } = await this.getRequest(`${this.prefix}/info`, {
      id
    })
    return data
  }
}

module.exports = App