const { v4 } = require('uuid')
const FormData = require('form-data')
const fs = require('fs')
const { promisify } = require('util')
const DisApp = require('./disapp')
const App = require('./app')
const path = require('path')
const sleep = require('sleep-promise')
const { get, replace, startCase, compose, mapKeys } = require('lodash/fp')
class OSS {
  constructor({ getRequest, client }) {
    this.getRequest = getRequest
    this.client = client
    this.prefix = '/oss'
    this.disapp = new DisApp({ getRequest })
    this.app = new App({ getRequest })
  }
  async getSign({ bucket = 'hiapp-package', dir = 'ipa' }) {
    const { data } = await this.getRequest(`${this.prefix}/getsign`, {
      bucket,
      dir
    })
    return data
  }
  /**
   * 
   * @param {*} signed result from getSign method
   */
  getOSSFormData({ host, dir, policy, signature, callback, accessid, filePath = 'Expo_v2.9.0.apk' }) {
    const params = {
      host,
      key: this.getUUidV4Key(dir) + path.extname(filePath),
      policy,
      Signature: signature,
      callback,
      OSSAccessKeyId: accessid
    }
    const formData = new FormData()
    for(let key in params) {
      formData.append(key, params[key])
    }
    formData.append('file', fs.createReadStream(filePath), path.basename(filePath))
    return { formData, params }
  }
  /**
   * 获取到key
   * @param {*} dir 
   */
  getUUidV4Key(dir) {
    return `${dir}/${v4().replace(/\-/g, '')}`
  }
  async doUpload(respData) {
    const url = respData && respData.host
    const { formData, params } = this.getOSSFormData(respData)
    const upload = promisify(formData.submit.bind(formData))
    try {
    await upload(url)
    const { id } = await OSS.repeatRequest(async() => this.disapp.parse({ objectName: get('key')(params) }), async () => new Error('parse failed'), {})
    const result = await OSS.repeatRequest(async() => this.app.info({ id }), async () => new Error('get info failed'), {})
    return result
    }catch(err) {
      throw err
      debugger
    }
   }
  static async repeatRequest(requestfn, failedFn, { count = 0, inteval = 2000 }) {
    const retryTimes = 3
    try {
      return await requestfn()
    } catch (err) {
      if (count !== retryTimes) {
        await sleep(inteval)
        return await OSS.repeatRequest(requestfn, failedFn, { count: count + 1, inteval })
      } else if (count === retryTimes) {
        // throw '请求超时'
        return await failedFn()
      } else {
        throw err
      }
    }
  }
}

module.exports = OSS