import axios from 'axios'
import Cookies from 'js-cookie'
import { Message } from 'element-ui'

const ENV = process.env.NODE_ENV === 'development' ? 'dev' : 'pro'
const TOKEN_NAME = 'BEARER_TOKEN'
const DEFAULTOPTION = {
  method: 'post',
  warning: true,
  login: true
}

const host = {
  dev: 'http://172.16.6.213:41220',
  pro: '/finance-account'
}

const { CancelToken } = axios
const service = axios.create({
  baseURL: host[ENV],
  timeout: 100000
})

// 请求头参数
function getCookies() {
  return {
    Authorization: Cookies.get(TOKEN_NAME),
    'W-FLOW': Cookies.get('W-FLOW') || 'default',
    'W-SEQ': Cookies.get('W-SEQ') || '1569595974015_2',
    ip: Cookies.get('ip') || 'http://127.0.0.1'
  }
}

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
  conf.headers.common = Object.assign(conf.headers.common, getCookies())
  return conf
})

service.interceptors.response.use(res => res.data, (err) => {
  Message({
    message: err.message || (`请求失败, 服务端无响应${err}`),
    type: err.message ? 'warning' : 'error',
    duration: 4500
  })
  return Promise.reject(err)
})

function getMessage(code, str) {
  if (!str) return 0
  const matchStr = str.split(`${code}:`)
  const re = /[\u4e00-\u9fa5]+/
  const message = matchStr[matchStr.length - 1]

  return re.test(message) ? message : 0
}

export const request = {
  temp(url, conf = {}) {
    return function factory(data, customer) {
      const newConf = Object.assign({}, DEFAULTOPTION, conf, customer)
      const _data = {
        url,
        method: newConf.method,
        [newConf.method === 'post' ? 'data' : 'params']: data || {}
      }
      const handle = this ? request.handle.bind(this) : request.handle
      return handle(_data, newConf)
    }
  },
  handle(data, conf) {
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
    return service(data).then((res) => {
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
        const tipTxt = (conf.failTxt || '') + (getMessage(code, message) || '')
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
}

export default request
