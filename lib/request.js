const Axios = require('axios')
const qs = require('qs')


class Request {
  constructor({ token }) {
    const baseURL =  'https://www.51gsc.com'
    this.client = Axios.create({
      baseURL: process.env.BASEURL || baseURL,
      transformRequest: [qs.stringify],
      headers: {
        'Origin': baseURL,
        'User-Agent': 'Mozilla/5.0 (Windows NT 6.1; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/73.0.3683.103 Safari/537.36'
      }
    });
    this.client.interceptors.request.use(function (config) {
      config.data['token'] = token;
      return config
    }, function (err) {
      return Promise.reject(err)
    });
  }
  getRequest(path, params) {
    return new Promise((resolve, reject) => {
      this.client.post(`/api/${path}`, {
        ...params
      }).then((response) => {
        var data = response.data;
        if (data.code && data.code != 0) {
          let returnMessage = data.message ||'NOTOK';
          if (data.data && typeof data.data === 'string') {
            returnMessage = data.result;
          } else if (data.message && typeof data.message === 'string') {
            returnMessage = data.message;
          }
          return reject(returnMessage);
        }

        if (data.error) {
          var message = data.error;
          if(typeof data.error === 'object' && data.error.message){
            message = data.error.message;
          }
          return reject(new Error(message));
        }

        resolve(data);
      }).catch(err => {
        return reject(err)
      })
    })
  }
}


module.exports = Request
