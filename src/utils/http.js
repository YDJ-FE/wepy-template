import wepy from 'wepy'
import qs from 'qs'
import { state } from '@/utils/store'
import { logMessage, debounce, userLogin } from '@/utils/helper'

const $logMessage = debounce(logMessage, 300)
// const $reLogin = debounce(reLogin, 300)

const methods = ['get', 'post']

const hideLoading = () => {
  wepy.hideLoading()
  wepy.hideNavigationBarLoading()
}

export default class Http {
  http = {}
  baseUrl = ''
  apiUnauthorizedCache = {}

  constructor(baseUrl) {
    this.baseUrl = baseUrl
    this.init()
  }

  init() {
    methods.forEach(method => {
      this.http[method] = async (apiName, data, apiOpts) => {
        const opts = {
          showNavigationBarLoading: true,
          showMaskLoading: false,
          shouldAddToken: true,
          shouldShowUniyErrorTips: true,
          shouldAddUserId: true,
          ...apiOpts
        }

        if (opts.showNavigationBarLoading) wepy.showNavigationBarLoading()
        if (opts.showMaskLoading) {
          wepy.showLoading({
            mask: true
          })
        }
        try {
          // 微信 收到开发者服务成功返回就会执行success（而不会理论http status状态），
          const res = await wepy.request({
            method: method.toUpperCase(),
            url: `${this.baseUrl}${apiName}`,
            data:
              method === 'post'
                ? qs.stringify(this.makeQueryParams(data, opts))
                : this.makeQueryParams(data, opts),
            header: {
              'content-type': 'application/x-www-form-urlencoded'
            }
          })
          hideLoading()
          const apiResponse = res.data
          const httpStatus = res.statusCode
          if (httpStatus === 200) {
            if (apiResponse.code === 1 || apiResponse.code === 200) {
              return Promise.resolve(apiResponse)
            }
          }
          if (httpStatus === 401) {
            // TODO 这里需要做重新登录再请求
            if (this.apiUnauthorizedCache[apiName] > 10) {
              $logMessage('请求超过10')
              return Promise.reject(apiResponse)
            }
            wepy.clearStorageSync()
            await userLogin()
            this.apiUnauthorizedCache[apiName] =
              Number(this.apiUnauthorizedCache[apiName]) + 1
            await this.http[method](apiName, data, apiOpts)
            delete this.apiUnauthorizedCache[apiName]
          }
          if (opts.shouldShowUniyErrorTips) {
            $logMessage(apiResponse.message)
          }
          return Promise.reject(apiResponse)
        } catch (error) {
          $logMessage('网络开小差哦，请稍后再做尝试')
          hideLoading()
        }
      }
    })
  }
  makeQueryParams(data = {}, apiOpts) {
    const { token, userId } = state.userInfo
    const ts = parseInt(`${Date.now() / 1000}`, 10)
    const tmp = {
      ts,
      format: 'array',
      ...data
    }
    if (apiOpts.shouldAddUserId) {
      tmp.user_id = userId || wepy.getStorageSync('userId')
    }
    if (apiOpts.shouldAddToken) {
      tmp.token = token || wepy.getStorageSync('token')
    }
    return tmp
  }
}
