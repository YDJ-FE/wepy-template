import wepy from 'wepy'
import { logMessage } from '@/utils/helper'
import { login } from '@/utils/api'
import isEmpty from 'lodash.isempty'
import { state } from '@/utils/store'

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
    key: ''
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
