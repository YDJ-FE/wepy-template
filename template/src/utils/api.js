import Http from '@/utils/http'
import config from '@/utils/config'

const httpInstance = new Http(config.url)

const { get, post } = httpInstance.http

export const login = (data = {}) => get('api/user/wxaSingle/login', data)
