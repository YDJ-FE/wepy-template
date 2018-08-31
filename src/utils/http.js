import wepy from 'wepy'
import qs from 'qs'
import { state, mutation } from '@/utils/store'
import { debounce, logMessage, reLogin } from '@/utils'

const $logMessage = debounce(logMessage, 300)
const $reLogin = debounce(reLogin, 300)

const methods = ['get', 'post']

export default class Http {
  http = {}
  baseUrl = ''

  constructor(baseUrl) {
    this.baseUrl = baseUrl
    this.init()
  }

  init() {
    methods.forEach(method => {
      this.http[method] = async (
        apiName,
        data,
        apiOpts = {
          showNavigationBarLoading: true,
          showMaskLoading: false,
          shouldAddToken: true,
          shouldShowUniyErrorTips: true,
          shouldAddUserId: true
        }
      ) => {
        try {
          if (apiOpts.showNavigationBarLoading) wepy.showNavigationBarLoading()
          if (apiOpts.showMaskLoading) {
            wepy.showLoading({
              mask: true
            })
          }
          const res = await wepy.request({
            method: method.toUpperCase(),
            url: `${this.baseUrl}${apiName}`,
            data:
              method === 'post'
                ? qs.stringify(this.makeQueryParams(data, apiOpts))
                : this.makeQueryParams(data, apiOpts),
            header: {
              'content-type': 'application/x-www-form-urlencoded'
            }
          })
          // console.log('res', res)
          wepy.hideLoading()
          wepy.hideNavigationBarLoading()
          return this.getDifferentResult(res, apiOpts, apiName)
        } catch (error) {
          wepy.hideLoading()
          wepy.hideNavigationBarLoading()
          console.log('error', error)
        }
      }
    })
    Object.keys(this.http).forEach(v => {
      this[v] = this.http[v]
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

  getDifferentResult(res, apiOpts, apiName) {
    const apiResponse = res.data
    switch (res.statusCode) {
      case 200:
        mutation.updateRequestInfo(apiName, 'clear')
        if (apiResponse.code === 1 || apiResponse.code === 200) {
          return Promise.resolve(apiResponse.data)
        } else {
          if (apiOpts.shouldShowUniyErrorTips) {
            $logMessage(apiResponse.message)
          }
          return Promise.reject(apiResponse)
        }
      case 401:
        mutation.updateRequestInfo(apiName)
        if (state.requestInfo.count < 10) {
          $reLogin()
        }
        return Promise.reject(apiResponse)
      case 403:
        mutation.updateRequestInfo(apiName)
        if (state.requestInfo.count < 10) {
          $reLogin()
        }
        return Promise.reject(apiResponse)
      default: {
        $logMessage(apiResponse.message)
        return Promise.reject(apiResponse)
      }
    }
  }
}
