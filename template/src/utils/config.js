export const env = '__env__'

const config = {
  dev: {
    env,
    url: 'https://test-wxa.yidejia.com/index.php/'
  },
  sit: {
    env,
    url: 'https://test-wxa.yidejia.com/index.php/'
  },
  prod: {
    env,
    url: 'https://wxa.yidejia.com/'
  }
}

export default config[env]
