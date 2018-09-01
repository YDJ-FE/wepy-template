import Http from '@/utils/http'
import config from '@/utils/config'

const httpInstance = new Http(config.url)

const { get } = httpInstance.http

export const login = (data = {}) => get('', data)
