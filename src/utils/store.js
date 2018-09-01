// import wepy from 'wepy'
// import { getUserInfo, getGroupList, bindGroup } from '@/utils/api'

export const state = {
  userInfo: {},
  appId: '',
  urlShareCpsId: ''
}

export const mutation = {
  updateUserInfo(value) {
    state.userInfo = value
  }
}

export const action = {
  async fetchSelfUserInfo() {}
}
