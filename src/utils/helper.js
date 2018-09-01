import wepy from 'wepy'
import { login } from '@/utils/api'
import { state } from '@/utils/store'
import isEmpty from 'lodash.isempty'

export const logMessage = msg => {
  wepy.showModal({
    title: '',
    content: String(msg),
    showCancel: false
  })
}

// 微信登录
export const wxLogin = async () => {
  try {
    const wxLoginRes = await wepy.login()
    return wxLoginRes
  } catch (error) {
    logMessage('微信登录失败')
  }
}

// 业务登录
export const userLogin = async () => {
  const { appId, urlShareCpsId } = state
  const wxLoginRes = await wxLogin()
  // TODO 这里需要修改对应的 Key
  const res = await login({
    appid: appId,
    code: wxLoginRes.code,
    rd_session_key: wepy.getStorageSync('session'),
    cps_id: urlShareCpsId,
    key: 'fw_wxaSingle_user'
  })
  wepy.setStorageSync('token', res.token)
  wepy.setStorageSync('session', res.rd_session_key)
}

// 检测本地是否 缓存 凭证
export const checkLocalStorage = async () => {
  if (wepy.getStorageSync('token') && wepy.getStorageSync('session')) {
    // TODO 这里如果本地有缓存 token session 凭证，就 请求全局初始化数据
    if (isEmpty(state.userInfo)) {
      // await action.fetchSelfUserInfo()
    }
  } else {
    wepy.clearStorageSync()
    await userLogin()
  }
}

// 检测微信 session 是否过期
export const checkWxSession = async () => {
  try {
    await wepy.checkSession()
  } catch (error) {
    wepy.clearStorageSync()
    await userLogin()
  }
}

// 用户本地凭证校验，全局数据获取
export const initGlobalData = async () => {
  await checkWxSession()
  await checkLocalStorage()
}

// 延迟执行
export const debounce = function(func, delay) {
  let inDebounce
  return function() {
    const context = this
    const args = arguments
    clearTimeout(inDebounce)
    inDebounce = setTimeout(() => func.apply(context, args), delay)
  }
}

/* 获取当前页带参数的url */
export const getCurrentPageUrlWithArgs = () => {
  // eslint-disable-next-line
  const pages = getCurrentPages() // 获取加载的页面
  const currentPage = pages[pages.length - 1] // 获取当前页面的对象
  const url = currentPage.route.split('/')[1] // 当前页面url
  const options = currentPage.options // 如果要获取url中所带的参数可以查看options

  // 拼接url的参数
  let urlWithArgs = url + '?'
  for (let key in options) {
    var value = options[key]
    urlWithArgs += key + '=' + value + '&'
  }
  urlWithArgs = urlWithArgs.substring(0, urlWithArgs.length - 1)

  return urlWithArgs
}

// 重启应用
export const reLogin = msg => {
  wepy.clearStorageSync()
  wepy.reLaunch({
    url: getCurrentPageUrlWithArgs()
  })
}
