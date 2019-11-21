import axios from 'axios'
import Cookies from 'js-cookie'

const isPro = process.env.NODE_ENV === 'production'
const { CancelToken } = axios
// const DEFAULTOPTION = { // 默认选项
//   method: 'post',
//   warning: true,
//   checkWarning: true,
//   login: true,
//   isAddSoid: true
// }

export class Request {
  constructor (config) {
    const baseURL = config[isPro ? 'proBaseUrl': 'devBaseUrl'] || ''
    this.service = axios.create({
      baseURL: baseURL,
      timeout: 100000
    })
    this.Message = config.Message || null
    this.defaultOption = Object.assign({ // 默认选项
      method: 'post',
      warning: true,
      checkWarning: true,
      login: true,
      isAddSoid: true
    }, config)
    // 添加请求拦截
    Request.requestInterceptor(this.service, this.Message)
    // 添加返回拦截
    Request.responseInterceptor(this.service, this.Message)
  }

  // 设置请求头参数
  static getCookies () {
    return {
      Authorization: Cookies.get('BEARER_TOKEN'),
      'W-FLOW': Cookies.get('W-FLOW') || 'default',
      'W-SEQ': Cookies.get('W-SEQ') || '1569595974015_2',
      ip: Cookies.get('ip') || 'http://127.0.0.1'
    }
  }
  static getMessage (code, str) {
    if (!str) return 0
    const matchStr = str.split(`${code}:`)
    const re = /[\u4e00-\u9fa5]+/
    const message = matchStr[matchStr.length - 1]
  
    return re.test(message) ? message : 0
  }

  static requestInterceptor (service) {
    // 添加 token
     function getUserInfo () {
      const userInfo = Cookies.get('userInfo')
      return userInfo ? JSON.parse(userInfo) : null
    }
    let userInfo = getUserInfo()
    service.interceptors.request.use((conf) => {
      const userConf = conf.headers['x-user-config']
      const {
        checkFn, refixFn, source, isAddSoid, checkWarning
      } = userConf
      // 提交前处理数据
      if (conf.data && refixFn) {
        conf.data = refixFn(conf.data)
      }
      // 提交前数据校验
      if (conf.data && checkFn) {
        const message = checkFn(conf.data)
        if (message) {
          source.cancel({ text: message, warning: checkWarning })
        }
      }
      // 无userInfo 重新获取userInfo
      if (!userInfo) {
        userInfo = getUserInfo()
      }
      // 统一添加 hospitalSOID
      if (isAddSoid && userInfo && userInfo.hospitalSOID) {
        if (!conf.data) {
          conf.data = {}
        }
        conf.data.hospitalSOID = userInfo.hospitalSOID
      }
      // 删除配置信息
      conf.headers['x-user-config'] = null
      // 添加系统参数
      conf.headers.common = Object.assign(conf.headers.common, Request.getCookies())
      return conf
    })
  }

  static responseInterceptor (service, Message) {
    service.interceptors.response.use(res => res.data, (err) => {
      let { message = `请求失败, 服务端无响应${err}` } = err
      if (message.warning === false) {
        return Promise.reject(message.text || message)
      }
      if (message.warning && message.text) {
        message = message.text
      }
      Message({
        message,
        type: 'error',
        duration: 4500
      })
      return Promise.reject(message.text || message || '请求失败, 服务端无响应')
    })
  }

  static handle (data, conf, self) {
    // 处理是否取消请求
    if (conf.checkFn) {
      const source = CancelToken.source()
      data.cancelToken = source.token
      conf.source =source
    }
    // loading 状态
    const setLoadingState = (bool) => {
      if (conf.loading && this[conf.loading] !== undefined) {
        this[conf.loading] = bool
      }
    }
    setLoadingState(true)
    return self.service(data).then((res) => {
      setLoadingState(false)
      if (res.success && conf.successTxt && conf.warning) {
        self.Message({
          message: conf.successTxt,
          type: 'success',
          duration: conf.duration || 4500
        })
      }
      if (!res.success && conf.warning) {
        const { code, message } = res.errorDetail
        const tipTxt = (conf.failTxt || '') + (Request.getMessage(code, message) || '')
        if (tipTxt && tipTxt !== 'undefined') {
          self.Message({
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
    const self =this
    return function factory (data, customer) {
      const newConf = Object.assign({}, self.defaultOption, conf, customer)
      const _data = {
        url,
        method: newConf.method,
        [newConf.method === 'post' ? 'data' : 'params']: data || {},
        headers: {
          'x-user-config': newConf
        }
      }
      const handle = this ? Request.handle.bind(this) : Request.handle
      return handle(_data, newConf, self)
    }
  }
}

export default Request
