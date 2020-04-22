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
  /**
   * @return 
   * { bundle_id: "host.exp.exponent"
   * icon: "http://public.hiapp.net/icon/5cd7d2cc0ab74a608e6999aed9d40128.png"
   * is_failed: 0
   * name: "Expo"
   * platform: "android"
   * record_id: "6efd37a5998ea8c649089946ca312510"
   * size: "25.6"
   * version: "2.2.0" }
   * @param {*} respData 
   */
  async doUpload(respData) {
    const url = respData && respData.host
    const { formData, params } = this.getOSSFormData(respData)
    const upload = promisify(formData.submit.bind(formData))
    await upload(url)
    const { id } = await OSS.repeatRequest(async () => this.disapp.parse({ objectName: get('key')(params) }), async () => new Error('parse failed'), {})
    const result = await OSS.repeatRequest(async () => this.app.info({ id }), async () => new Error('get info failed'), { successCondition: (result) => result && result.name})
    return result
  }
  static async repeatRequest(requestfn, failedFn, { count = 0, inteval = 2000, successCondition }) {
    const retryTimes = 3
    try {
      const result = await requestfn()
      if(successCondition && successCondition(result) || !successCondition) {
        return result;
      }else {
        throw new Error('without result')
      }
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