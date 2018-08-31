// 之后考虑把全局变量接入此模块
/* eslint-disable */

import wepy from 'wepy'
import { getUserInfo, getGroupList, bindGroup } from '@/utils/api'

export const state = {
  userInfo: {}
}

export const mutation = {
  updateUserInfo(value) {
    state.userInfo = value
  }
}

export const action = {
  async fetchSelfUserInfo() {}
}
