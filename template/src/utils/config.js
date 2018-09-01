export const env = '__env__'

const config = {
  dev: {
    env,
    url: ''
  },
  sit: {
    env,
    url: ''
  },
  prod: {
    env,
    url: ''
  }
}

export default config[env]
