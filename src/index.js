import axios from 'axios'
import Cookies from 'js-cookie'
import { Message } from 'element-ui'

const isPro = process.env.NODE_ENV === 'production'
const { CancelToken } = axios
const DEFAULTOPTION = { // 默认选项
  method: 'post',
  warning: true,
  login: true
}

export class Request {
  constructor (config) {
    const baseURL = config[isPro ? 'proBaseUrl': 'devBaseUrl'] || ''
    this.service = axios.create({
      baseURL: baseURL,
      timeout: 100000
    })
    // 添加请求拦截
    Request.requestInterceptor(this.service)
    // 添加返回拦截
    Request.responseInterceptor(this.service)
  }

  // 设置请求头参数
  static getCookies() {
    return {
      Authorization: Cookies.get('BEARER_TOKEN'),
      'W-FLOW': Cookies.get('W-FLOW') || 'default',
      'W-SEQ': Cookies.get('W-SEQ') || '1569595974015_2',
      ip: Cookies.get('ip') || 'http://127.0.0.1'
    }
  }
  static getMessage(code, str) {
    if (!str) return 0
    const matchStr = str.split(`${code}:`)
    const re = /[\u4e00-\u9fa5]+/
    const message = matchStr[matchStr.length - 1]
  
    return re.test(message) ? message : 0
  }

  static requestInterceptor (service) {
    // 添加 token
    service.interceptors.request.use((conf) => {
      const {
        data, checkFn, source, refixFn
      } = conf
      if (data && refixFn) {
        conf.data = refixFn(data)
      }
      if (data && checkFn) {
        const message = checkFn(data)
        if (message) {
          source.cancel(message)
        }
      }
      // 添加系统参数
      conf.headers.common = Object.assign(conf.headers.common, Request.getCookies())
      return conf
    })
  }

  static responseInterceptor (service) {
    service.interceptors.response.use(res => res.data, (err) => {
      Message({
        message: err.message || (`请求失败, 服务端无响应${err}`),
        type: err.message ? 'warning' : 'error',
        duration: 4500
      })
      return Promise.reject(err)
    })
  }

  static handle (data, conf) {
    // 处理提交数据
    if (conf.refixFn) {
      data.refixFn = conf.refixFn
    }
    // 处理是否取消请求
    if (conf.checkFn) {
      const source = CancelToken.source()
      data.checkFn = conf.checkFn
      data.cancelToken = source.token
      data.source = source
    }
    // loading 状态
    const setLoadingState = (bool) => {
      if (conf.loading && this[conf.loading] !== undefined) {
        this[conf.loading] = bool
      }
    }
    setLoadingState(true)
    return this.service(data).then((res) => {
      setLoadingState(false)
      if (res.success && conf.successTxt) {
        Message({
          message: conf.successTxt,
          type: 'success',
          duration: conf.duration || 4500
        })
      }
      if (!res.success && conf.warning) {
        const { code, message } = res.errorDetail
        const tipTxt = (conf.failTxt || '') + (Request.getMessage(code, message) || '')
        if (tipTxt && tipTxt !== 'undefined') {
          Message({
            message: tipTxt,
            type: 'error',
            duration: conf.duration || 4500
          })
        }
      }
      return res
    }).catch((err) => {
      setLoadingState(false)
      return Promise.reject(err)
    })
  }

  temp (url, conf = {}) {
    return function factory (data, customer) {
      const newConf = Object.assign({}, DEFAULTOPTION, conf, customer)
      const _data = {
        url,
        method: newConf.method,
        [newConf.method === 'post' ? 'data' : 'params']: data || {}
      }
      const handle = this ? Request.handle.bind(this) : Request.handle
      return handle(_data, newConf)
    }
  }
}

export default Request
